import { getAPI, parseError } from 'api-4markdown';
import type { API4MarkdownDto } from 'api-4markdown-contracts';
import { useUploadImageState } from 'store/upload-image';
import type { AsyncResult } from 'development-kit/utility-types';

const uploadImageAct = async (
  image: string,
): AsyncResult<API4MarkdownDto<'uploadImage'>> => {
  try {
    useUploadImageState.swap({ is: `busy` });

    const data = await getAPI().call(`uploadImage`)({
      image,
    });

    useUploadImageState.swap({ is: `ok` });
    return { is: `ok`, data };
  } catch (rawError: unknown) {
    const error = parseError(rawError);
    useUploadImageState.swap({ is: `fail`, error });

    return { is: `fail`, error };
  }
};

export { uploadImageAct };
