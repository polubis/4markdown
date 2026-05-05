import type {
  EmbeddedNode,
  ExternalNode,
  SolidEdge,
} from "api-4markdown-contracts";

type MindmapVisualMetaNode = EmbeddedNode | ExternalNode;
type MindmapVisualMetaNodeId = MindmapVisualMetaNode[`id`];
type MindmapVisualMetaInput = {
  name?: string | null;
  nodes: MindmapVisualMetaNode[];
  edges: SolidEdge[];
  orientation: `x` | `y`;
};

const createSlug = (text: string): string =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, ``)
    .replace(/[\s_-]+/g, `-`)
    .replace(/^-+|-+$/g, ``);

const sanitizeFileSegment = (segment: string): string =>
  String(segment)
    .replace(/[<>:"/\\|?*]+/g, `-`)
    .trim();

const getNodeExportFileName = (node: MindmapVisualMetaNode): string => {
  const baseName = createSlug(node.data.name ?? ``) || `node`;
  const safeId = sanitizeFileSegment(node.id);
  return `${sanitizeFileSegment(`${baseName}-${safeId}`)}.md`;
};

const compareNodesByLayout = (
  a: MindmapVisualMetaNode,
  b: MindmapVisualMetaNode,
): number => {
  const dy = a.position.y - b.position.y;
  if (dy !== 0) return dy;
  const dx = a.position.x - b.position.x;
  if (dx !== 0) return dx;
  return String(a.id).localeCompare(String(b.id));
};

/**
 * Builds a markdown file with an ASCII tree preview of the mindmap.
 *
 * Algorithm:
 * 1. Treat edges as directed (source → target).
 * 2. Roots = nodes with no incoming edges. If none (cycles), pick the
 *    lexicographically smallest node id as a single artificial root.
 * 3. Depth-first traversal from each root in layout order; each node is
 *    printed at most once (first visit wins), so the result is a forest of
 *    reachability trees.
 * 4. Nodes never reached from the chosen roots are listed in a trailing section.
 */
const buildMindmapVisualMetaMd = ({
  name,
  nodes,
  edges,
  orientation,
}: MindmapVisualMetaInput): string => {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const outgoing = new Map<
    MindmapVisualMetaNodeId,
    MindmapVisualMetaNodeId[]
  >();
  const inDegree = new Map<MindmapVisualMetaNodeId, number>();

  for (const n of nodes) {
    outgoing.set(n.id, []);
    inDegree.set(n.id, 0);
  }

  for (const e of edges) {
    if (!nodeMap.has(e.source) || !nodeMap.has(e.target)) continue;
    const list = outgoing.get(e.source);
    if (!list) continue;
    if (!list.includes(e.target)) list.push(e.target);
    inDegree.set(e.target, (inDegree.get(e.target) ?? 0) + 1);
  }

  for (const [id, targets] of outgoing) {
    const uniq = [...new Set(targets)];
    uniq.sort((a, b) => {
      const na = nodeMap.get(a);
      const nb = nodeMap.get(b);
      if (!na || !nb) return String(a).localeCompare(String(b));
      return compareNodesByLayout(na, nb);
    });
    outgoing.set(id, uniq);
  }

  let rootIds: MindmapVisualMetaNodeId[] = nodes
    .filter((n) => (inDegree.get(n.id) ?? 0) === 0)
    .map((n) => n.id);

  if (rootIds.length === 0 && nodes.length > 0) {
    const sortedIds = [...nodes].sort(compareNodesByLayout).map((n) => n.id);
    rootIds = [sortedIds[0]!];
  } else {
    rootIds.sort((a, b) => {
      const na = nodeMap.get(a);
      const nb = nodeMap.get(b);
      if (!na || !nb) return String(a).localeCompare(String(b));
      return compareNodesByLayout(na, nb);
    });
  }

  const lines: string[] = [];
  const visited = new Set<MindmapVisualMetaNodeId>();

  const dfs = (
    id: MindmapVisualMetaNodeId,
    prefix: string,
    isLast: boolean,
    isRoot: boolean,
  ): void => {
    if (visited.has(id)) return;
    visited.add(id);
    const node = nodeMap.get(id);
    if (!node) return;

    const branch = isRoot ? `` : isLast ? `└── ` : `├── `;
    const nodeFileName = getNodeExportFileName(node);
    lines.push(`${prefix}${branch}${nodeFileName}`);

    const rawKids = outgoing.get(id) ?? [];
    const children = rawKids.filter((c) => !visited.has(c) && nodeMap.has(c));
    const ext = isRoot ? `` : `${prefix}${isLast ? `    ` : `│   `}`;

    children.forEach((childId, i) => {
      dfs(childId, ext, i === children.length - 1, false);
    });
  };

  rootIds.forEach((rootId, index) => {
    if (index > 0 && !visited.has(rootId)) {
      lines.push(``);
    }
    dfs(rootId, ``, true, true);
  });

  const unreachable = nodes
    .filter((n) => !visited.has(n.id))
    .sort(compareNodesByLayout);

  if (unreachable.length > 0) {
    lines.push(``);
    lines.push(`---`);
    lines.push(
      `Not reached from roots (disconnected or skipped cycle branch):`,
    );
    for (const n of unreachable) {
      lines.push(`  • ${getNodeExportFileName(n)}`);
    }
  }

  const title = (name ?? ``).trim() || `mindmap`;
  const header = [
    `# Visual meta`,
    ``,
    `Mindmap: \`${title.replace(/`/g, `'`)}\``,
    `Orientation: **${orientation}**`,
    `Nodes: **${nodes.length}** · Edges: **${edges.length}**`,
    ``,
    `ASCII tree follows directed edges from root nodes (in-degree 0). If every node has an incoming edge, traversal starts from the top-left node by layout.`,
    ``,
    `\`\`\`text`,
    ...lines,
    `\`\`\``,
    ``,
  ];

  return `${header.join(`\n`)}\n`;
};

export type { MindmapVisualMetaInput };
export { buildMindmapVisualMetaMd };
