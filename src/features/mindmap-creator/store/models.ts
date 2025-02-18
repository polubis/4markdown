import type { SUID } from 'development-kit/suid';

type NodeDataBase = {
  name: string;
  path: `/${string}/`;
  description: string | null;
};

type MakeEdge<TType extends string> = {
  id: SUID;
  type: TType;
  source: SUID;
  target: SUID;
};

type MakeNode<TType extends string, TData extends Record<string, any>> = {
  id: SUID;
  position: {
    x: number;
    y: number;
  };
  measured?: {
    height: number;
    width: number;
  };
  type: TType;
  selected: boolean;
  data: TData;
};

type MindmapCreatorEdge = MakeEdge<`solid`>;
type MindmapCreatorNode =
  | MakeNode<`embedded`, NodeDataBase & { content: string | null }>
  | MakeNode<`external`, NodeDataBase & { url: string }>;

type MindmapCreatorStore = {
  orientation: `x` | `y`;
  nodes: MindmapCreatorNode[];
  edges: MindmapCreatorEdge[];
};

export type { MindmapCreatorStore };
