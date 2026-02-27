import { getAPI, parseError } from "api-4markdown";
import { useUploadImageState } from "store/upload-image";
import { addAssetsAction } from "features/assets-management/store/actions";

const uploadImageAct = async (image: string): Promise<void> => {
  try {
    useUploadImageState.swap({ is: `busy` });

    const data = await getAPI().call(`uploadImage`)({
      image,
    });

    useUploadImageState.swap({ is: `ok`, ...data });
    // Also add the uploaded image to the assets-management store at the top
    addAssetsAction([data]);
  } catch (error: unknown) {
    useUploadImageState.swap({ is: `fail`, error: parseError(error) });
  }
};

export { uploadImageAct };
