#!/usr/bin/env python3
"""
Content Sync — Syncs TIL and Team content from Obsidian vault to aleister-site.

Obsidian source: ~/.openclaw/workspace/obsidian/aleister-remote/
Website target:  ~/.openclaw/workspace/aleister-site/src/content/

Converts Obsidian heading-based metadata to Astro YAML frontmatter.
Runs via OpenClaw cron every 5 minutes for near-instant updates.
"""

import os
import re
import subprocess
import sys
from typing import Optional

OBSIDIAN_ROOT = os.path.expanduser("~/.openclaw/workspace/obsidian/aleister-remote")
SITE_ROOT = os.path.expanduser("~/.openclaw/workspace/aleister-site")
SITE_CONTENT = os.path.join(SITE_ROOT, "src/content")


# ─── TIL Sync ─────────────────────────────────────────────────

def parse_obsidian_til(filepath: str) -> Optional[dict]:
    """Parse an Obsidian TIL file and extract metadata + content."""
    with open(filepath, "r") as f:
        text = f.read()

    if not text.strip():
        return None

    lines = text.split("\n")
    title = ""
    date = ""
    summary = ""
    tags = []
    content_start = 0

    for i, line in enumerate(lines):
        stripped = line.strip()
        if stripped.startswith("# ") and not title:
            title = stripped[2:].strip()
            date_match = re.match(r"(\d{4}-\d{2}-\d{2})\s*[-–—]\s*", title)
            if date_match:
                title = title[date_match.end():].strip()
            content_start = i + 1
        elif stripped.startswith("## Date:"):
            date = stripped.replace("## Date:", "").strip()
            content_start = max(content_start, i + 1)
        elif stripped.startswith("## Summary:"):
            summary = stripped.replace("## Summary:", "").strip()
            content_start = max(content_start, i + 1)
        elif stripped.startswith("## Tags:"):
            raw_tags = stripped.replace("## Tags:", "").strip()
            tags = [t.strip() for t in raw_tags.split(",") if t.strip()]
            content_start = max(content_start, i + 1)
        elif stripped.startswith("### "):
            break

    if not date:
        basename = os.path.basename(filepath).replace(".md", "")
        if re.match(r"\d{4}-\d{2}-\d{2}", basename):
            date = basename

    if not title:
        title = f"TIL — {date}"

    title = re.sub(r"^Today I Learned:\s*", "", title)

    body_lines = lines[content_start:]
    while body_lines and not body_lines[0].strip():
        body_lines.pop(0)
    body = "\n".join(body_lines)

    return {"title": title, "date": date, "summary": summary, "tags": tags, "body": body}


def til_to_astro(meta: dict) -> str:
    tags_str = ", ".join(f'"{t}"' for t in meta["tags"]) if meta["tags"] else ""
    parts = ["---"]
    parts.append(f'title: "{meta["title"]}"')
    parts.append(f'date: "{meta["date"]}"')
    if meta["summary"]:
        safe = meta["summary"].replace('"', '\\"')
        parts.append(f'summary: "{safe}"')
    if tags_str:
        parts.append(f"tags: [{tags_str}]")
    parts.append("---")
    parts.append("")
    parts.append(meta["body"])
    return "\n".join(parts)


# ─── Team Sync ─────────────────────────────────────────────────

def parse_obsidian_team(filepath: str) -> Optional[dict]:
    """Parse an Obsidian team profile and extract metadata + content."""
    with open(filepath, "r") as f:
        text = f.read()

    if not text.strip():
        return None

    lines = text.split("\n")
    meta = {
        "name": "", "codename": "", "role": "", "model": "",
        "color": "", "avatar": "", "traits": [], "description": ""
    }
    body_lines = []
    in_body = False
    desc_lines = []
    in_description = False

    for i, line in enumerate(lines):
        stripped = line.strip()

        if in_body:
            body_lines.append(line)
            continue

        if stripped.startswith("# ") and not meta["name"]:
            meta["name"] = stripped[2:].strip()
        elif stripped.startswith("## Codename:"):
            meta["codename"] = stripped.replace("## Codename:", "").strip()
        elif stripped.startswith("## Role:"):
            meta["role"] = stripped.replace("## Role:", "").strip()
        elif stripped.startswith("## Model:"):
            meta["model"] = stripped.replace("## Model:", "").strip()
        elif stripped.startswith("## Color:"):
            meta["color"] = stripped.replace("## Color:", "").strip()
        elif stripped.startswith("## Avatar:"):
            meta["avatar"] = stripped.replace("## Avatar:", "").strip()
        elif stripped.startswith("## Traits:"):
            raw = stripped.replace("## Traits:", "").strip()
            meta["traits"] = [t.strip() for t in raw.split(",") if t.strip()]
        elif stripped.startswith("### Description"):
            in_description = True
        elif stripped.startswith("### Personality") or stripped.startswith("### Skills"):
            in_description = False
            in_body = True
            # Convert ### to ## for Astro rendering
            body_lines.append(line.replace("### ", "## ", 1))
        elif in_description:
            desc_lines.append(stripped)

    meta["description"] = " ".join(desc_lines).strip()

    # Process body: convert remaining ### to ## for consistent Astro rendering
    body_text = "\n".join(body_lines)
    # Sub-headings under Skills (#### Skill Name) → ### Skill Name
    body_text = re.sub(r"^#### ", "### ", body_text, flags=re.MULTILINE)

    if not meta["name"]:
        return None

    return {**meta, "body": body_text}


def team_to_astro(meta: dict) -> str:
    traits = '", "'.join(meta["traits"])
    desc = meta["description"].replace('"', '\\"')

    parts = ["---"]
    parts.append(f'name: "{meta["name"]}"')
    parts.append(f'codename: "{meta["codename"]}"')
    parts.append(f'role: "{meta["role"]}"')
    parts.append(f'model: "{meta["model"]}"')
    parts.append(f'color: "{meta["color"]}"')
    parts.append(f'avatar: "{meta["avatar"]}"')
    if traits:
        parts.append(f'traits: ["{traits}"]')
    else:
        parts.append('traits: []')
    parts.append(f'description: "{desc}"')
    parts.append("---")
    parts.append("")
    parts.append(meta["body"])
    return "\n".join(parts)


# ─── Generic Sync ──────────────────────────────────────────────

def sync_directory(src_dir: str, dst_dir: str, parser, converter, label: str):
    """Sync a directory of Obsidian files to Astro format."""
    os.makedirs(dst_dir, exist_ok=True)
    synced = 0
    skipped = 0
    errors = 0

    if not os.path.isdir(src_dir):
        print(f"  ⚠️  Source dir not found: {src_dir}")
        return 0, 0, 0

    for filename in sorted(os.listdir(src_dir)):
        if not filename.endswith(".md") or filename == "README.md":
            continue

        src = os.path.join(src_dir, filename)
        dst = os.path.join(dst_dir, filename)

        try:
            meta = parser(src)
            if not meta:
                skipped += 1
                continue

            content = converter(meta)

            if os.path.exists(dst):
                with open(dst, "r") as f:
                    if f.read() == content:
                        skipped += 1
                        continue

            with open(dst, "w") as f:
                f.write(content)
            synced += 1
            print(f"  ✅ [{label}] {filename}")

        except Exception as e:
            print(f"  ❌ [{label}] {filename} — {e}")
            errors += 1

    return synced, skipped, errors


def git_push(total_synced: int):
    """Commit and push changes."""
    if total_synced == 0:
        return

    os.chdir(SITE_ROOT)
    subprocess.run(["git", "add", "src/content/til/", "src/content/team/"], check=True)

    result = subprocess.run(["git", "diff", "--cached", "--quiet"])
    if result.returncode == 0:
        print("  No changes to commit")
        return

    subprocess.run(
        ["git", "commit", "-m", f"content: sync {total_synced} file(s) from Obsidian vault"],
        check=True,
    )
    subprocess.run(["git", "push"], check=True)
    print(f"  📤 Pushed {total_synced} file(s) → Vercel will rebuild")


def main():
    print("🔄 Content Sync: Obsidian → Aleister Site")

    # TIL sync
    t_synced, t_skipped, t_errors = sync_directory(
        os.path.join(OBSIDIAN_ROOT, "TIL"),
        os.path.join(SITE_CONTENT, "til"),
        parse_obsidian_til, til_to_astro, "TIL"
    )

    # Team sync
    m_synced, m_skipped, m_errors = sync_directory(
        os.path.join(OBSIDIAN_ROOT, "team"),
        os.path.join(SITE_CONTENT, "team"),
        parse_obsidian_team, team_to_astro, "Team"
    )

    total_synced = t_synced + m_synced
    total_errors = t_errors + m_errors
    print(f"\n  TIL:  {t_synced} synced, {t_skipped} unchanged, {t_errors} errors")
    print(f"  Team: {m_synced} synced, {m_skipped} unchanged, {m_errors} errors")

    if total_synced > 0:
        git_push(total_synced)

    if total_errors == 0:
        print("✅ Done")
    else:
        print(f"⚠️  Done with {total_errors} error(s)")


if __name__ == "__main__":
    main()
