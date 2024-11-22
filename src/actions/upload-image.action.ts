import { getAPI } from 'api-4markdown';
import { readFileAsBase64 } from 'development-kit/file-reading';
import type { API4MarkdownDto } from 'api-4markdown-contracts';
import { imagesStoreActions } from 'store/images/images.store';

// @TODO[PRIO=5]: [Design single way of handling error cases?].
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
