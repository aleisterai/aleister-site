#!/usr/bin/env python3
"""
Debug version of content sync
"""

import os
import re
import subprocess
import sys
from typing import Optional

OBSIDIAN_ROOT = os.path.expanduser("~/.openclaw/workspace/obsidian/aleister-remote")
SITE_ROOT = os.path.expanduser("~/.openclaw/workspace/aleister-site")
SITE_CONTENT = os.path.join(SITE_ROOT, "src/content")


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

        print(f"\n  Processing {filename}:")
        print(f"    Source: {src}")
        print(f"    Destination: {dst}")
        print(f"    Source exists: {os.path.exists(src)}")
        print(f"    Destination exists: {os.path.exists(dst)}")

        try:
            meta = parser(src)
            if not meta:
                print(f"    Parser returned None, skipping")
                skipped += 1
                continue

            print(f"    Parsed successfully")
            content = converter(meta)

            if os.path.exists(dst):
                with open(dst, "r") as f:
                    existing = f.read()
                if existing == content:
                    print(f"    Content identical, skipping")
                    skipped += 1
                    continue
                else:
                    print(f"    Content differs, will sync")
            else:
                print(f"    Destination doesn't exist, will create")

            with open(dst, "w") as f:
                f.write(content)
            synced += 1
            print(f"    ✅ Synced")

        except Exception as e:
            print(f"    ❌ Error: {e}")
            errors += 1

    return synced, skipped, errors


def main():
    print("🔄 Debug Content Sync: Obsidian → Aleister Site")

    # TIL sync
    t_synced, t_skipped, t_errors = sync_directory(
        os.path.join(OBSIDIAN_ROOT, "TIL"),
        os.path.join(SITE_CONTENT, "til"),
        parse_obsidian_til, til_to_astro, "TIL"
    )

    print(f"\n  TIL:  {t_synced} synced, {t_skipped} unchanged, {t_errors} errors")

    if t_errors == 0:
        print("✅ Done")
    else:
        print(f"⚠️  Done with {t_errors} error(s)")


if __name__ == "__main__":
    main()