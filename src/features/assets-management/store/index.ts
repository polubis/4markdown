import { create } from "zustand";
import { AssetsManagementState } from "./models";
import { createSelectors } from "development-kit/create-selectors";

const useAssetsManagementStore = createSelectors(
  create<AssetsManagementState>(() => ({
    idle: true,
    busy: false,
    error: null,
    assets: [],
    selectedAssetIds: new Set<string>(),
  })),
);

export { useAssetsManagementStore };
