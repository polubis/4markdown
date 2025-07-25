import { createSelectors } from "development-kit/create-selectors";
import type { ResourcesCompletionState } from "./models";
import { create } from "zustand";

const useResourcesCompletionState = createSelectors(
  create<ResourcesCompletionState>(() => ({
    idle: true,
    busy: false,
    error: null,
    completions: {},
  })),
);

export { useResourcesCompletionState };
