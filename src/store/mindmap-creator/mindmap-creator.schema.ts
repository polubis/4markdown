import { z } from 'zod';

const mindmapSchema = z.object({
  id: z.string(),
  name: z.string().min(2).max(100),
});

// id: Id;
// name: Name;
// description?: string;
// cdate: Date;
// mdate: Date;
// nodes: MindmapNode[];
// edges: MindmapEdge[];
// orientation: MindmapOrientation;
