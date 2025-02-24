// import { getAPI, parseError } from 'api-4markdown';
// import type { API4MarkdownPayload, MindmapDto } from 'api-4markdown-contracts';
// import { type AsyncResult } from 'development-kit/utility-types';
// import { useMindmapCreatorState } from 'store/mindmap-creator';

// const createMindmapAct = async (
//   payload: Pick<
//     API4MarkdownPayload<`createMindmap`>,
//     'description' | 'name' | 'tags'
//   >,
// ): AsyncResult<MindmapDto> => {
//   try {
//     const { nodes, edges, orientation } = useMindmapCreatorState.get();

//     const data = await getAPI().call(`createMindmap`)({
//       nodes,
//       edges,
//       orientation,
//       ...payload,
//     });

//     useMindmapCreatorState.set({
//       mindmapForm: { is: `closed` },
//     });

//     return { is: `ok`, data };
//   } catch (error: unknown) {
//     return { is: `fail`, error: parseError(error) };
//   }
// };

// export { createMindmapAct };
