import { z } from 'zod';

const id = z.string();
const position = z.object({
  x: z.number(),
  y: z.number(),
});
const nodeName = z
  .string()
  .min(2)
  .max(100)
  .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ' -]$/);
const nodeDescription = z.string().min(25).max(300).optional();

const zodMindmapSchema = z.object({
  id,
  name: z.string().min(2).max(100),
  description: z.string().min(25).max(300).optional(),
  orientation: z.enum([`x`, `y`]),
  cdate: z.string().date(),
  mdate: z.string().date(),
  nodes: z.array(
    z.union([
      z.object({
        type: z.literal(`internal`),
        id,
        position,
        data: z
          .object({
            id,
          })
          .nullable(),
      }),
      z.object({
        type: z.literal(`external`),
        id,
        position,
        data: z.object({
          name: nodeName,
          description: nodeDescription,
          path: z.string().url(),
        }),
      }),
    ]),
  ),
  edges: z.array(
    z.object({
      id,
      source: id,
      target: id,
      type: z.enum([`curved`, `linear`]),
    }),
  ),
});

export { zodMindmapSchema };
