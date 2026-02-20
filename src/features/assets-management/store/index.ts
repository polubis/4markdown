import { create } from "zustand";
import { AssetsManagementState } from "./models";
import { createSelectors } from "development-kit/create-selectors";

const useAssetsManagementStore = createSelectors(
  create<AssetsManagementState>(() => ({
    idle: true,
    busy: false,
    error: null,
    assets: [],
    hasMore: false,
    nextCursor: null,
    selectedAssetIds: new Set<string>(),
  })),
);

export { useAssetsManagementStore };
