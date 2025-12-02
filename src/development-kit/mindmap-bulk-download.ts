import JSZip from "jszip";
import type {
  MindmapCreatorEdge,
  MindmapCreatorNode,
} from "store/mindmap-creator/models";
import { downloadBlob } from "./download-blob";

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

type GraphStructure = {
  adjacencyList: Record<string, string[]>;
  rootNodes: MindmapCreatorNode[];
};

const regexes = {
  FILENAME_SAFE: /[^a-zA-Z0-9-_]/g,
  PATH_TRIM: /^\/|\/$/g,
  YAML_ESCAPE_QUOTES: /"/g,
} as const;

const getGraphStructure = (
  nodes: MindmapCreatorNode[],
  edges: MindmapCreatorEdge[],
): GraphStructure => {
  const adjacencyList: Record<string, string[]> = {};
  const incomingEdges: Record<string, string[]> = {};

  edges.forEach((edge) => {
    if (!adjacencyList[edge.source]) adjacencyList[edge.source] = [];
    if (!incomingEdges[edge.target]) incomingEdges[edge.target] = [];

    adjacencyList[edge.source].push(edge.target);
    incomingEdges[edge.target].push(edge.source);
  });

  const rootNodes = nodes.filter((node) => !incomingEdges[node.id]);

  return { adjacencyList, rootNodes };
};

const buildFileTree = (
  nodes: MindmapCreatorNode[],
  graphStructure: GraphStructure,
): FileTree => {
  const { adjacencyList, rootNodes } = graphStructure;

  const getNodePath = (node: MindmapCreatorNode) =>
    node.data.path?.replace(regexes.PATH_TRIM, "") || node.id;

  const processNode = (node: MindmapCreatorNode, pathPrefix = ""): FileTree => {
    const nodePath = getNodePath(node);
    const fullPath = pathPrefix ? `${pathPrefix}/${nodePath}` : nodePath;

    let content = "";
    if (node.type === "embedded") {
      content = node.data.content || "";
    } else if (node.type === "external") {
      content = `# ${node.data.name}\n\n${node.data.description || ""}\n\nURL: ${node.data.url}\n`;
    }

    const escapeYaml = (str: string) =>
      str.replace(regexes.YAML_ESCAPE_QUOTES, '\\"');

    const metaContent = `---
title: "${escapeYaml(node.data.name || "")}"
description: "${escapeYaml(node.data.description || "")}"
---`;

    const currentLevelFiles: FileTree = {
      [`${nodePath}.md`]: content,
      [`${nodePath}.meta.md`]: metaContent,
    };

    const childrenIds = adjacencyList[node.id] || [];
    const childrenFolders = childrenIds
      .map((id) => nodes.find((n) => n.id === id))
      .filter(Boolean) as MindmapCreatorNode[];

    const subDirectories = childrenFolders.reduce<FileTree>((acc, child) => {
      const childDirName = getNodePath(child);
      acc[childDirName] = processNode(child, fullPath);
      return acc;
    }, {});

    return {
      ...currentLevelFiles,
      ...subDirectories,
    };
  };

  return rootNodes.reduce<FileTree>((acc, rootNode) => {
    const rootDirName = getNodePath(rootNode);
    acc[rootDirName] = processNode(rootNode);
    return acc;
  }, {});
};

const buildStructureJson = (
  nodes: MindmapCreatorNode[],
  graphStructure: GraphStructure,
): NodeStructure[] => {
  const { adjacencyList, rootNodes } = graphStructure;
  const processNodeStructure = (
    node: MindmapCreatorNode,
    pathPrefix = "",
  ): NodeStructure => {
    const nodePath = node.data.path?.replace(regexes.PATH_TRIM, ``) || node.id;
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
      name: node.data.name || ``,
      path: fullPath,
      children: childStructures,
    };
  };

  return rootNodes.map((rootNode) => processNodeStructure(rootNode));
};

const addFilesToZip = (zip: JSZip, fileTree: FileTree, path = ""): void => {
  Object.entries(fileTree).forEach(([key, value]) => {
    const currentPath = path ? `${path}/${key}` : key;

    if (typeof value === `string`) {
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

    const graphStructure = getGraphStructure(
      mindmapData.nodes,
      mindmapData.edges,
    );

    const fileTree = buildFileTree(mindmapData.nodes, graphStructure);
    const structureData = buildStructureJson(mindmapData.nodes, graphStructure);

    zip.file(`structure.json`, JSON.stringify(structureData, null, 2));

    addFilesToZip(zip, fileTree);

    const zipBlob = await zip.generateAsync({ type: `blob` });

    downloadBlob(
      zipBlob,
      `${mindmapName.replace(regexes.FILENAME_SAFE, "_")}.zip`,
    );
  } catch (error) {
    console.error(`Error creating ZIP file:`, error);
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
  downloadBlob,
  type MindmapData,
  type FileTree,
  type NodeStructure,
  type GraphStructure,
};
