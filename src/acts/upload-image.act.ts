import { getAPI, parseError } from 'api-4markdown';
import { readFileAsBase64 } from 'development-kit/file-reading';
import type { API4MarkdownDto } from 'api-4markdown-contracts';
import { useImagesState } from 'store/images';
import type { AsyncResult } from 'development-kit/utility-types';

const uploadImageAct = async (
  image: File,
): AsyncResult<API4MarkdownDto<'uploadImage'>> => {
  try {
    useImagesState.swap({ is: `busy` });

    const data = await getAPI().call(`uploadImage`)({
      image: await readFileAsBase64(image),
    });

    useImagesState.swap({ is: `ok` });

    return { is: `ok`, data };
  } catch (rawError: unknown) {
    const error = parseError(rawError);
    useImagesState.swap({ is: `fail`, error });

    return { is: `fail`, error };
  }
};

export { uploadImageAct };
