import * as yup from 'yup';

const id = yup.string().required();
const position = yup.object({
  x: yup.number().required(),
  y: yup.number().required(),
});
const nodeName = yup
  .string()
  .min(2)
  .max(100)
  .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ' -]$/, `Invalid name format`);
const nodeDescription = yup.string().min(25).max(300).optional();

const yupMindmapSchema = yup.object({
  id: id.required(),
  name: yup.string().min(2).max(100).required(),
  description: yup.string().min(25).max(300).optional(),
  orientation: yup.mixed().oneOf([`x`, `y`]).required(),
  cdate: yup.date().required(),
  mdate: yup.date().required(),
  nodes: yup
    .array(
      yup.mixed().oneOf([
        yup.object({
          type: yup.mixed().oneOf([`internal`]).required(),
          id: id.required(),
          position: position.required(),
          data: yup
            .object({
              id,
            })
            .nullable(),
        }),
        yup.object({
          type: yup.mixed().oneOf([`external`]).required(),
          id: id.required(),
          position: position.required(),
          data: yup
            .object({
              name: nodeName.required(),
              description: nodeDescription,
              path: yup.string().url().required(),
            })
            .required(),
        }),
      ]),
    )
    .required(),
  edges: yup
    .array(
      yup.object({
        id: id.required(),
        source: id.required(),
        target: id.required(),
        type: yup.mixed().oneOf([`curved`, `linear`]).required(),
      }),
    )
    .required(),
});

export type Mindmap = yup.InferType<typeof yupMindmapSchema>;

export { yupMindmapSchema };
