import type { MindmapDto } from 'api-4markdown-contracts';
import { meta } from '../../meta';

const createPathForMindmap = (
  id: MindmapDto['id'],
  path: MindmapDto['path'],
) => {
  return (
    meta.routes.mindmaps.mindmap.slice(0, -1) + path.slice(0, -1) + id + `/`
  );
};

export { createPathForMindmap };
