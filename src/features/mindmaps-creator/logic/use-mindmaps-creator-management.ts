import React from 'react';
import { useMindmapsCreatorCtx } from '../providers/mindmaps-creator.provider';

const generateId = (): string => new Date().toISOString();

const useMindmapsCreatorManagement = () => {
  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    onConnect,
    onEdgesChange,
    onNodesChange,
  } = useMindmapsCreatorCtx();

  const addNode = (): void => {
    setNodes((prevNodes) => [
      ...prevNodes,
      {
        id: generateId(),
        position: { x: 0, y: 0 },
        data: { label: `test` },
        type: `initial`,
      },
    ]);
  };

  React.useEffect(() => {
    setNodes(() => [
      { id: `1`, position: { x: 0, y: 0 }, data: { label: `1` } },
      { id: `2`, position: { x: 0, y: 100 }, data: { label: `2` } },
      {
        id: `node-1`,
        type: `internal-link`,
        position: { x: 0, y: 300 },
        data: { value: 123 },
      },
    ]);
    setEdges(() => [
      { id: `e1-2`, source: `1`, target: `2` },
      { id: `e1-3`, source: `1`, target: `node-1` },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    nodes,
    edges,
    addNode,
    setEdges,
    onConnect,
    onEdgesChange,
    onNodesChange,
  };
};

export { useMindmapsCreatorManagement };
