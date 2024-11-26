import { getAPI, parseError } from 'api-4markdown';
import { readFileAsBase64 } from 'development-kit/file-reading';
import type { API4MarkdownDto } from 'api-4markdown-contracts';
import { imagesStoreActions } from 'store/images/images.store';
import type { AsyncResult } from 'development-kit/utility-types';

const uploadImageAct = async (
  image: File,
): AsyncResult<API4MarkdownDto<'uploadImage'>> => {
  try {
    imagesStoreActions.busy();

    const data = await getAPI().call(`uploadImage`)({
      image: await readFileAsBase64(image),
    });

    imagesStoreActions.ok();

    return { is: `ok`, data };
  } catch (error: unknown) {
    imagesStoreActions.fail(error);
    return { is: `fail`, error: parseError(error) };
  }
};

export { uploadImageAct };
