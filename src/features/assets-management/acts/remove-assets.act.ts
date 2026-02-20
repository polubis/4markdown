import { getAPI, parseError } from "api-4markdown";
import { useAssetsManagementStore } from "../store";
import { removeAssetsAction } from "../store/actions";

const removeAssetsAct = async (assetIds: string[]): Promise<void> => {
  try {
    useAssetsManagementStore.setState({
      busy: true,
      error: null,
    });

    // MOCK IMPLEMENTATION - Comment out when real API is ready
    await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate network delay

    // Optimistically remove assets from UI
    removeAssetsAction(assetIds);

    // REAL API CALL - Uncomment when backend is ready
    // await getAPI().call(`removeAssets`)({
    //   assetIds: assetIds as Array<{ id: string }>,
    // });

    useAssetsManagementStore.setState({
      busy: false,
    });
  } catch (error: unknown) {
    // On error, we could restore the assets, but for simplicity we'll just show error
    useAssetsManagementStore.setState({
      busy: false,
      error: parseError(error),
    });
    throw error;
  }
};

export { removeAssetsAct };
