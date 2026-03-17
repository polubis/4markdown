import type {
  EmbeddedNode,
  ExternalNode,
  SolidEdge,
} from "api-4markdown-contracts";

type MindmapExportNode = EmbeddedNode | ExternalNode;
type MindmapExportEdge = SolidEdge;
type MindmapExportInput = {
  name?: string | null;
  nodes: MindmapExportNode[];
  edges: MindmapExportEdge[];
  orientation: "x" | "y";
};

const createSlug = (text: string): string =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, ``)
    .replace(/[\s_-]+/g, `-`)
    .replace(/^-+|-+$/g, ``);

const downloadBlob = ({
  blob,
  name,
  extension,
}: {
  blob: Blob;
  name: string;
  extension: string;
}) => {
  const anchor = document.createElement(`a`);
  anchor.href = URL.createObjectURL(blob);
  anchor.download = `${name}.${extension}`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
};

const createZipWorker = (jszipUrl: string) => {
  const workerSource = `
    const sanitizeFileSegment = (segment) =>
      String(segment).replace(/[<>:"/\\\\|?*]+/g, "-").trim();

    const createSlug = (text) =>
      text
        .toLowerCase()
        .trim()
        .replace(/[^\\w\\s-]/g, "")
        .replace(/[\\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");

    const toFrontmatterValue = (value) =>
      "\\"" + String(value).replace(/"/g, "\\\\\\"") + "\\"";

    const buildIdList = (ids) => {
      if (!ids || ids.length === 0) return "[]";
      return (
        "\\n" +
        ids.map((id) => "- " + toFrontmatterValue(id)).join("\\n")
      );
    };

    const buildFrontmatter = (node) => {
      const frontmatter = [
        "---",
        "id: " + toFrontmatterValue(node.id),
        "title: " + toFrontmatterValue(node.data.name),
        "type: " + toFrontmatterValue(node.type),
        "path: " + toFrontmatterValue(node.data.path),
      ];

      if (node.data.description) {
        frontmatter.push("description: " + toFrontmatterValue(node.data.description));
      }

      if (node.type === "external") {
        frontmatter.push("url: " + toFrontmatterValue(node.data.url));
      }

      frontmatter.push("before:" + buildIdList(node.before));
      frontmatter.push("after:" + buildIdList(node.after));

      frontmatter.push("---", "");
      return frontmatter.join("\\n");
    };

    const buildMarkdown = (node) => {
      const frontmatter = buildFrontmatter(node);
      if (node.type === "embedded") {
        const content = node.data.content ?? "";
        return (frontmatter + content).trimEnd() + "\\n";
      }
      return frontmatter;
    };

    self.onmessage = async (event) => {
      const { payload, jszipUrl } = event.data;
      try {
        self.importScripts(jszipUrl);
        const zip = new self.JSZip();
        const baseName = createSlug(payload.name ?? "") || "mindmap";
        const root = zip.folder(sanitizeFileSegment(baseName)) ?? zip;

        const edges = payload.edges ?? [];
        const beforeMap = Object.create(null);
        const afterMap = Object.create(null);
        edges.forEach((edge) => {
          if (!afterMap[edge.source]) afterMap[edge.source] = [];
          if (!beforeMap[edge.target]) beforeMap[edge.target] = [];
          afterMap[edge.source].push(edge.target);
          beforeMap[edge.target].push(edge.source);
        });

        const structure = {
          version: "1.0",
          orientation: payload.orientation,
          nodes: payload.nodes.map((node) => {
            const baseName = createSlug(node.data.name ?? "") || "node";
            const safeId = sanitizeFileSegment(node.id);
            const fileName = sanitizeFileSegment(baseName + "-" + safeId) + ".md";
            return {
              id: node.id,
              title: node.data.name,
              type: node.type,
              description: node.data.description,
              path: node.data.path,
              position: node.position,
              contentFile: fileName,
              ...(node.type === "external" ? { url: node.data.url } : {}),
            };
          }),
          edges: edges.map((edge) => ({
            id: edge.id,
            type: edge.type,
            source: edge.source,
            target: edge.target,
          })),
        };

        root.file("structure.json", JSON.stringify(structure, null, 2));

        payload.nodes.forEach((node) => {
          const baseName = createSlug(node.data.name ?? "") || "node";
          const safeId = sanitizeFileSegment(node.id);
          const fileName = sanitizeFileSegment(baseName + "-" + safeId) + ".md";
          const before = beforeMap[node.id] ?? [];
          const after = afterMap[node.id] ?? [];
          const decoratedNode = { ...node, before, after };
          root.file(fileName, buildMarkdown(decoratedNode));
        });

        const arrayBuffer = await zip.generateAsync({ type: "arraybuffer" });
        self.postMessage({ arrayBuffer, name: baseName }, [arrayBuffer]);
      } catch (error) {
        self.postMessage({
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    };
  `;

  const workerBlob = new Blob([workerSource], { type: `text/javascript` });
  return new Worker(URL.createObjectURL(workerBlob));
};

const downloadMindmapAsFolder = ({
  name,
  nodes,
  edges,
  orientation,
}: MindmapExportInput): Promise<void> => {
  const jszipUrl = new URL(
    `jszip/dist/jszip.min.js`,
    import.meta.url,
  ).toString();
  const worker = createZipWorker(jszipUrl);

  return new Promise((resolve, reject) => {
    worker.onmessage = (event) => {
      const { arrayBuffer, error, name: zipName } = event.data ?? {};
      if (error) {
        worker.terminate();
        reject(new Error(error));
        return;
      }

      const blob = new Blob([arrayBuffer], { type: `application/zip` });
      downloadBlob({ blob, name: zipName ?? `mindmap`, extension: `zip` });
      worker.terminate();
      resolve();
    };

    worker.onerror = (event) => {
      worker.terminate();
      reject(event.error ?? new Error(`Zip worker failed`));
    };

    worker.postMessage({
      payload: { name, nodes, edges, orientation },
      jszipUrl,
    });
  });
};

export { downloadMindmapAsFolder };
