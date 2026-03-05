import type { APIRoute } from 'astro';

// ── Board configuration (one-to-many) ────────────────────────────────
interface BoardConfig {
    owner: string;
    ownerType: 'user' | 'organization';
    projectNumber: number;
    label: string;
    isPublic: boolean;
}

const BOARDS: BoardConfig[] = [
    { owner: 'aleisterai', ownerType: 'user', projectNumber: 3, label: "Aleister's Tasks", isPublic: true },
    { owner: 'aleisterai', ownerType: 'user', projectNumber: 1, label: "Aleister Project #1", isPublic: true },
    { owner: 'aleisterai', ownerType: 'user', projectNumber: 2, label: "Aleister Project #2", isPublic: true },
    { owner: 'FundlyHub', ownerType: 'organization', projectNumber: 1, label: "FundlyHub Board", isPublic: false },
];

const GITHUB_TOKEN = import.meta.env.GITHUB_TOKEN || process.env.GITHUB_TOKEN || '';

// Shared fragment for project items — used by both user and org queries
const ITEMS_FRAGMENT = `
  title
  items(first: 100, orderBy: {field: POSITION, direction: ASC}) {
    totalCount
    nodes {
      content {
        ... on Issue {
          title
          number
          url
          state
          createdAt
          updatedAt
          labels(first: 5) {
            nodes { name color }
          }
          repository {
            name
            isPrivate
          }
          assignees(first: 3) {
            nodes { login }
          }
        }
        ... on DraftIssue {
          title
          createdAt
          updatedAt
        }
      }
      fieldValues(first: 10) {
        nodes {
          ... on ProjectV2ItemFieldSingleSelectValue {
            name
            field { ... on ProjectV2SingleSelectField { name } }
          }
          ... on ProjectV2ItemFieldTextValue {
            text
            field { ... on ProjectV2Field { name } }
          }
        }
      }
    }
  }
`;

const USER_QUERY = `
  query($login: String!, $number: Int!) {
    user(login: $login) {
      projectV2(number: $number) { ${ITEMS_FRAGMENT} }
    }
  }
`;

const ORG_QUERY = `
  query($login: String!, $number: Int!) {
    organization(login: $login) {
      projectV2(number: $number) { ${ITEMS_FRAGMENT} }
    }
  }
`;

async function fetchBoard(board: BoardConfig) {
    if (!GITHUB_TOKEN) {
        return { board: board.label, error: 'No GITHUB_TOKEN configured', items: [] };
    }

    const query = board.ownerType === 'organization' ? ORG_QUERY : USER_QUERY;

    try {
        const response = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            headers: {
                'Authorization': `bearer ${GITHUB_TOKEN}`,
                'Content-Type': 'application/json',
                'User-Agent': 'AleisterDashboard/1.0',
            },
            body: JSON.stringify({
                query,
                variables: { login: board.owner, number: board.projectNumber },
            }),
            signal: AbortSignal.timeout(10000),
        });

        if (!response.ok) {
            return { board: board.label, error: `GitHub API ${response.status}`, items: [] };
        }

        const data = await response.json();
        const root = board.ownerType === 'organization' ? data?.data?.organization : data?.data?.user;
        const project = root?.projectV2;
        if (!project) {
            return { board: board.label, error: 'Project not found', items: [] };
        }

        const items = (project.items?.nodes || []).map((node: any) => {
            const content = node.content || {};
            const status = node.fieldValues?.nodes?.find(
                (fv: any) => fv.field?.name === 'Status'
            )?.name || 'Unknown';
            const assignedAgent = node.fieldValues?.nodes?.find(
                (fv: any) => fv.field?.name === 'Agent' || fv.field?.name === 'Assigned Agent'
            )?.text || node.fieldValues?.nodes?.find(
                (fv: any) => fv.field?.name === 'Agent' || fv.field?.name === 'Assigned Agent'
            )?.name || '';

            const isPrivateRepo = content.repository?.isPrivate ?? !board.isPublic;

            return {
                title: content.title || 'Untitled',
                number: content.number || null,
                url: isPrivateRepo ? null : (content.url || null),
                isPrivate: isPrivateRepo,
                state: content.state || 'DRAFT',
                status,
                assignedAgent,
                labels: (content.labels?.nodes || []).map((l: any) => ({
                    name: l.name,
                    color: l.color,
                })),
                assignees: (content.assignees?.nodes || []).map((a: any) => a.login),
                createdAt: content.createdAt || '',
                updatedAt: content.updatedAt || '',
                board: board.label,
                boardOwner: board.owner,
            };
        });

        return {
            board: board.label,
            title: project.title,
            totalCount: project.items?.totalCount || 0,
            items,
        };
    } catch (error) {
        console.error(`Error fetching board ${board.label}:`, error);
        return { board: board.label, error: 'Fetch failed', items: [] };
    }
}

export const GET: APIRoute = async () => {
    try {
        const boardResults = await Promise.all(BOARDS.map(fetchBoard));

        // Flatten all items with board metadata
        const allItems = boardResults.flatMap(b => b.items || []);

        // Categorize
        const tasksByStatus = {
            inProgress: allItems.filter(i => i.status === 'In Progress'),
            todo: allItems.filter(i => i.status === 'To Do' || i.status === 'Todo'),
            done: allItems.filter(i => i.status === 'Done'),
            backlog: allItems.filter(i => i.status === 'Backlog'),
        };

        return new Response(JSON.stringify({
            success: true,
            boards: boardResults.map(b => ({
                label: b.board,
                title: b.title,
                totalCount: b.totalCount,
                error: b.error,
            })),
            items: allItems,
            summary: {
                total: allItems.length,
                inProgress: tasksByStatus.inProgress.length,
                todo: tasksByStatus.todo.length,
                done: tasksByStatus.done.length,
                backlog: tasksByStatus.backlog.length,
            },
            timestamp: new Date().toISOString(),
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=120',
            },
        });
    } catch (error) {
        console.error('Error in project-board API:', error);
        return new Response(JSON.stringify({
            success: false,
            error: 'Internal error',
            boards: [],
            items: [],
            summary: { total: 0, inProgress: 0, todo: 0, done: 0, backlog: 0 },
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};
