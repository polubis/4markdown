import Joi from 'joi';

const id = Joi.string();
const position = Joi.object({
  x: Joi.number(),
  y: Joi.number(),
});
const nodeName = Joi.string()
  .min(2)
  .max(100)
  .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/);
const nodeDescription = Joi.string().min(25).max(300).optional();

const joiMindmapSchema = Joi.object({
  id,
  name: Joi.string().min(2).max(100),
  description: Joi.string().min(25).max(300).optional(),
  orientation: Joi.string().valid(`x`, `y`),
  cdate: Joi.date().iso(),
  mdate: Joi.date().iso(),
  nodes: Joi.array().items(
    Joi.alternatives().try(
      Joi.object({
        type: Joi.string().valid(`internal`),
        id,
        position,
        data: Joi.object({
          id,
        }).allow(null),
      }),
      Joi.object({
        type: Joi.string().valid(`external`),
        id,
        position,
        data: Joi.object({
          name: nodeName,
          description: nodeDescription,
          path: Joi.string().uri(),
        }),
      }),
    ),
  ),
  edges: Joi.array().items(
    Joi.object({
      id,
      source: id,
      target: id,
      type: Joi.string().valid(`curved`, `linear`),
    }),
  ),
});

export { joiMindmapSchema };
