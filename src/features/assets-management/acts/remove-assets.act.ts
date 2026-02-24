import type { Atoms } from "api-4markdown-contracts";
import { getAPI, parseError } from "api-4markdown";
import { useAssetsManagementStore } from "../store";
import { removeAssetsAction } from "../store/actions";

const removeAssetsAct = async (assetIds: string[]): Promise<void> => {
  try {
    if (assetIds.length === 0) {
      throw new Error("No images to delete");
    }

    useAssetsManagementStore.setState({
      busy: true,
      error: null,
    });

    const payload = assetIds.map((id) => ({ id: id as Atoms["ImageId"] }));
    await getAPI().call("deleteImage")(payload);

    removeAssetsAction(assetIds);

    useAssetsManagementStore.setState({
      busy: false,
    });
  } catch (error: unknown) {
    useAssetsManagementStore.setState({
      busy: false,
      error: parseError(error),
    });
    throw error;
  }
};

export { removeAssetsAct };
