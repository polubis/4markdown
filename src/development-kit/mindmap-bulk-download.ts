import JSZip from "jszip";
import type {
  MindmapCreatorEdge,
  MindmapCreatorNode,
} from "store/mindmap-creator/models";

type MindmapData = {
  orientation: string;
  nodes: MindmapCreatorNode[];
  edges: MindmapCreatorEdge[];
};

type FileTree = {
  [key: string]: string | FileTree;
};

type NodeStructure = {
  id: string;
  name: string;
  path: string;
  children: NodeStructure[];
};

const buildFileTree = (
  nodes: MindmapCreatorNode[],
  edges: MindmapCreatorEdge[],
): FileTree => {
  const adjacencyList: Record<string, string[]> = {};
  const incomingEdges: Record<string, string[]> = {};

  edges.forEach((edge) => {
    if (!adjacencyList[edge.source]) adjacencyList[edge.source] = [];
    if (!incomingEdges[edge.target]) incomingEdges[edge.target] = [];

    adjacencyList[edge.source].push(edge.target);
    incomingEdges[edge.target].push(edge.source);
  });
  const rootNodes = nodes.filter((node) => !incomingEdges[node.id]);

  const processNode = (node: MindmapCreatorNode, pathPrefix = ""): FileTree => {
    const nodePath = node.data.path?.replace(/^\/|\/$/g, "") || node.id;
    const fullPath = pathPrefix ? `${pathPrefix}/${nodePath}` : nodePath;

    let content = "";

    if (node.type === "embedded") {
      content = node.data.content || "";
    } else if (node.type === "external") {
      content = `# ${node.data.name}\n\n${node.data.description || ""}\n\nURL: ${node.data.url}\n`;
    }

    const result: FileTree = {};

    const fileName = `${nodePath}.md`;
    result[fileName] = content;

    const metaFileName = `${nodePath}.meta.md`;

    const escapeYaml = (str: string) => str.replace(/"/g, '\\"');
    const safeTitle = escapeYaml(node.data.name || "");
    const safeDesc = escapeYaml(node.data.description || "");

    const metaContent = `---
title: "${safeTitle}"
description: "${safeDesc}"
---`;

    result[metaFileName] = metaContent;
    const children = adjacencyList[node.id] || [];
    if (children.length > 0) {
      const childNodes = children
        .map((childId) => nodes.find((n) => n.id === childId))
        .filter(Boolean) as MindmapCreatorNode[];

      childNodes.forEach((childNode) => {
        result[childNode.data.path?.replace(/^\/|\/$/g, "") || childNode.id] =
          processNode(childNode, fullPath);
      });
    }

    return result;
  };

  const tree: FileTree = {};

  rootNodes.forEach((rootNode) => {
    const nodePath = rootNode.data.path?.replace(/^\/|\/$/g, "") || rootNode.id;
    tree[nodePath] = processNode(rootNode);
  });

  return tree;
};

const buildStructureJson = (
  rootNodes: MindmapCreatorNode[],
  nodes: MindmapCreatorNode[],
  adjacencyList: Record<string, string[]>,
): NodeStructure[] => {
  const processNodeStructure = (
    node: MindmapCreatorNode,
    pathPrefix = "",
  ): NodeStructure => {
    const nodePath = node.data.path?.replace(/^\/|\/$/g, "") || node.id;
    const fullPath = pathPrefix ? `${pathPrefix}/${nodePath}` : nodePath;

    const children = adjacencyList[node.id] || [];
    const childStructures: NodeStructure[] = [];

    if (children.length > 0) {
      const childNodes = children
        .map((childId) => nodes.find((n) => n.id === childId))
        .filter(Boolean) as MindmapCreatorNode[];

      childNodes.forEach((childNode) => {
        childStructures.push(processNodeStructure(childNode, fullPath));
      });
    }

    return {
      id: node.id,
      name: node.data.name || "",
      path: fullPath,
      children: childStructures,
    };
  };

  return rootNodes.map((rootNode) => processNodeStructure(rootNode));
};

const addFilesToZip = (zip: JSZip, fileTree: FileTree, path = ""): void => {
  Object.entries(fileTree).forEach(([key, value]) => {
    const currentPath = path ? `${path}/${key}` : key;

    if (typeof value === "string") {
      zip.file(currentPath, value);
    } else {
      addFilesToZip(zip, value, currentPath);
    }
  });
};

const downloadMindmapAsZip = async (
  mindmapData: MindmapData,
  mindmapName: string,
): Promise<void> => {
  try {
    const zip = new JSZip();

    const adjacencyList: Record<string, string[]> = {};
    const incomingEdges: Record<string, string[]> = {};

    mindmapData.edges.forEach((edge) => {
      if (!adjacencyList[edge.source]) adjacencyList[edge.source] = [];
      if (!incomingEdges[edge.target]) incomingEdges[edge.target] = [];

      adjacencyList[edge.source].push(edge.target);
      incomingEdges[edge.target].push(edge.source);
    });

    const rootNodes = mindmapData.nodes.filter(
      (node) => !incomingEdges[node.id],
    );

    const fileTree = buildFileTree(mindmapData.nodes, mindmapData.edges);
    const structureData = buildStructureJson(
      rootNodes,
      mindmapData.nodes,
      adjacencyList,
    );

    zip.file("structure.json", JSON.stringify(structureData, null, 2));

    addFilesToZip(zip, fileTree);

    const zipBlob = await zip.generateAsync({ type: "blob" });

    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${mindmapName.replace(/[^a-zA-Z0-9-_]/g, "_")}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error creating ZIP file:", error);
    throw error;
  }
};

const downloadMindmapsBulk = async (
  mindmaps: Array<{ data: MindmapData; name: string }>,
): Promise<void> => {
  for (const mindmap of mindmaps) {
    await downloadMindmapAsZip(mindmap.data, mindmap.name);
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
};

export {
  downloadMindmapAsZip,
  downloadMindmapsBulk,
  type MindmapData,
  type FileTree,
  type NodeStructure,
};
