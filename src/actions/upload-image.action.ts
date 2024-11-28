import { getAPI, parseError } from 'api-4markdown';
import { readFileAsBase64 } from 'development-kit/file-reading';
import type { API4MarkdownDto } from 'api-4markdown-contracts';
import { useImagesState } from 'store/images';

const uploadImage = async (
  image: File,
): Promise<API4MarkdownDto<'uploadImage'>> => {
  try {
    useImagesState.swap({ is: `busy` });

    const data = await getAPI().call(`uploadImage`)({
      image: await readFileAsBase64(image),
    });

    useImagesState.swap({ is: `ok` });

    return data;
  } catch (rawError: unknown) {
    const error = parseError(rawError);
    useImagesState.swap({ is: `fail`, error });

    throw error;
  }
};

export { uploadImage };
