import { getAPI } from 'api-4markdown';
import { readFileAsBase64 } from 'development-kit/file-reading';
import type { API4MarkdownDto } from 'api-4markdown-contracts';
import { useImagesState } from 'store/images';

const uploadImageAct = async (
  image: File,
): Promise<API4MarkdownDto<'uploadImage'>> => {
  try {
    useImagesState.setState({ is: `busy` });

    const data = await getAPI().call(`uploadImage`)({
      image: await readFileAsBase64(image),
    });

    useImagesState.setState({ is: `ok` });

    return data;
  } catch (error: unknown) {
    useImagesState.setState({ is: `fail` });
    imagesStoreActions.fail(error);
    throw error;
  }
};

export { uploadImageAct };
