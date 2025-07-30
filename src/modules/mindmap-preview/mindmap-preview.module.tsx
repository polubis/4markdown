import {
  Background,
  MiniMap,
  type NodeTypes,
  type EdgeTypes,
  ReactFlow,
  type EdgeProps,
  type NodeProps,
  Controls,
} from "@xyflow/react";
import React, { type ComponentType } from "react";
import { useMindmapPreviewState } from "store/mindmap-preview";
import { readyMindmapPreviewSelector } from "store/mindmap-preview/selectors";
import {
  ExternalNodeTileContainerX,
  ExternalNodeTileContainerY,
} from "./containers/external-node-tile.container";
import { SolidEdge } from "./components/solid-edge";
import type {
  MindmapPreviewEdge,
  MindmapPreviewOkMindmap,
} from "store/mindmap-preview/models";
import {
  EmbeddedNodeTileContainerX,
  EmbeddedNodeTileContainerY,
} from "./containers/embedded-node-tile.container";
import { closeNodePreviewAction } from "store/mindmap-preview/actions";
import { useResourceCompletionToggle } from "modules/resource-completions";
import {
  API4MarkdownPayload,
  MindmapId,
  MindmapNodeId,
} from "api-4markdown-contracts";
import { MindmapPreviewNodeWithCompletion } from "./models";
import { Button } from "design-system/button";
import { BiCheckboxChecked, BiCheckboxMinus } from "react-icons/bi";

const MarkdownWidget = React.lazy(() =>
  import("components/markdown-widget").then(({ MarkdownWidget }) => ({
    default: MarkdownWidget,
  })),
);

type MindmapNodeTypes = {
  [Orientation in MindmapPreviewOkMindmap["orientation"]]: {
    [Type in MindmapPreviewNodeWithCompletion["type"]]: ComponentType<
      NodeProps<Extract<MindmapPreviewNodeWithCompletion, { type: Type }>>
    >;
  };
};

type MindmapEdgeTypes = {
  [Type in MindmapPreviewEdge["type"]]: ComponentType<
    EdgeProps<Extract<MindmapPreviewEdge, { type: Type }>>
  >;
};

const mindmapNodeTypes: MindmapNodeTypes = {
  x: {
    external: ExternalNodeTileContainerX,
    embedded: EmbeddedNodeTileContainerX,
  },
  y: {
    external: ExternalNodeTileContainerY,
    embedded: EmbeddedNodeTileContainerY,
  },
};

const ResourceCompletionTriggerContainer = (
  props: API4MarkdownPayload<"setUserResourceCompletion">,
) => {
  const [state, completion, toggle] = useResourceCompletionToggle(props);
  // @TODO[PRIO=2]: [Handle error case with some toast or error message].
  return (
    <Button s={1} i={2} disabled={state.is === `busy`} onClick={toggle}>
      {completion ? (
        <BiCheckboxMinus size={24} />
      ) : (
        <BiCheckboxChecked size={24} />
      )}
    </Button>
  );
};
const edgeTypes: MindmapEdgeTypes = {
  solid: SolidEdge,
};

const MindmapPreviewModule = () => {
  const mindmap = useMindmapPreviewState((state) =>
    readyMindmapPreviewSelector(state.mindmap),
  );
  const nodePreview = useMindmapPreviewState((state) => state.nodePreview);

  const nodes = React.useMemo(
    () =>
      mindmap.nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          mindmapId: mindmap.id,
        },
      })),
    [mindmap.nodes, mindmap.id],
  );

  return (
    <>
      <ReactFlow
        nodes={nodes}
        edges={mindmap.edges}
        nodeTypes={mindmapNodeTypes[mindmap.orientation] as NodeTypes}
        edgeTypes={edgeTypes as EdgeTypes}
        fitView
      >
        <Controls />
        <Background />
        <MiniMap className="hidden md:block" />
      </ReactFlow>
      {nodePreview.is === `on` && (
        <React.Suspense>
          <MarkdownWidget
            headerControls={
              <ResourceCompletionTriggerContainer
                type="mindmap-node"
                resourceId={nodePreview.id as MindmapNodeId}
                parentId={mindmap.id as MindmapId}
              />
            }
            chunksActive={false}
            onClose={closeNodePreviewAction}
            markdown={nodePreview.data.content || `No content for this node`}
          />
        </React.Suspense>
      )}
    </>
  );
};

export { MindmapPreviewModule };
