import { create } from "zustand";
import { AccessGroupsManagementState } from "./models";
import { createSelectors } from "development-kit/create-selectors";

const useAccessGroupsManagementStore = createSelectors(
  create<AccessGroupsManagementState>(() => ({
    view: "list",
    idle: true,
    busy: false,
    error: null,
    accessGroups: [],
  })),
);

export { useAccessGroupsManagementStore };
