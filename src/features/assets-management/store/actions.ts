import { ImageDto } from "api-4markdown-contracts";
import { useAssetsManagementStore } from ".";

const addAssetsAction = (assets: ImageDto[]): void => {
  useAssetsManagementStore.setState((prevState) => ({
    ...prevState,
    // Prepend new assets so they appear first (newest at top)
    assets: [...assets, ...prevState.assets],
  }));
};

const setAssetsAction = (assets: ImageDto[]): void => {
  useAssetsManagementStore.setState({
    assets,
  });
};

const toggleAssetSelectionAction = (assetId: string): void => {
  useAssetsManagementStore.setState((prevState) => {
    const newSelectedIds = new Set(prevState.selectedAssetIds);
    if (newSelectedIds.has(assetId)) {
      newSelectedIds.delete(assetId);
    } else {
      newSelectedIds.add(assetId);
    }
    return {
      selectedAssetIds: newSelectedIds,
    };
  });
};

const selectAllAssetsAction = (): void => {
  useAssetsManagementStore.setState((prevState) => ({
    selectedAssetIds: new Set(prevState.assets.map((asset) => asset.id)),
  }));
};

const deselectAllAssetsAction = (): void => {
  useAssetsManagementStore.setState({
    selectedAssetIds: new Set<string>(),
  });
};

const removeAssetsAction = (assetIds: string[]): void => {
  useAssetsManagementStore.setState((prevState) => ({
    assets: prevState.assets.filter((asset) => !assetIds.includes(asset.id)),
    selectedAssetIds: new Set(
      Array.from(prevState.selectedAssetIds).filter(
        (id) => !assetIds.includes(id),
      ),
    ),
  }));
};

export {
  addAssetsAction,
  setAssetsAction,
  toggleAssetSelectionAction,
  selectAllAssetsAction,
  deselectAllAssetsAction,
  removeAssetsAction,
};
