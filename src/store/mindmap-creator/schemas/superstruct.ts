import {
  string,
  number,
  object,
  array,
  union,
  literal,
  optional,
  size,
  pattern,
  type Infer,
} from 'superstruct';

const id = string();
const position = object({
  x: number(),
  y: number(),
});

const nodeName = size(pattern(string(), /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/), 2, 100);

const nodeDescription = optional(size(string(), 25, 300));

const superstructMindmapSchema = object({
  id,
  name: size(string(), 2, 100),
  description: nodeDescription,
  orientation: union([literal(`x`), literal(`y`)]),
  cdate: pattern(string(), /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/),
  mdate: pattern(string(), /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/),
  nodes: array(
    union([
      object({
        type: literal(`internal`),
        id,
        position,
        data: optional(
          object({
            id,
          }),
        ),
      }),
      object({
        type: literal(`external`),
        id,
        position,
        data: object({
          name: nodeName,
          description: nodeDescription,
          path: pattern(string(), /^https?:\/\/[^\s/$.?#].[^\s]*$/),
        }),
      }),
    ]),
  ),
  edges: array(
    object({
      id,
      source: id,
      target: id,
      type: union([literal(`curved`), literal(`linear`)]),
    }),
  ),
});

export type Mindmap = Infer<typeof superstructMindmapSchema>;

export { superstructMindmapSchema };
