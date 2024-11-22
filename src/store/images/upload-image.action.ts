import { getAPI } from 'api-4markdown';
import { readFileAsBase64 } from 'development-kit/file-reading';
import { imagesStoreActions } from './images.store';
import type { API4MarkdownDto } from 'api-4markdown-contracts';

const uploadImage = async (
  image: File,
): Promise<API4MarkdownDto<'uploadImage'>> => {
  try {
    imagesStoreActions.busy();

    const data = await getAPI().call(`uploadImage`)({
      image: await readFileAsBase64(image),
    });

    imagesStoreActions.ok();

    return data;
  } catch (error: unknown) {
    imagesStoreActions.fail(error);
    throw error;
  }
};

export { uploadImage };
