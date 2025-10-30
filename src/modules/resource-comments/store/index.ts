import { createSelectors } from "development-kit/create-selectors";
import { create } from "zustand";
import { ResourceCommentsMeta, ResourceCommentsState } from "../models";

let resourceStoreMeta: ResourceCommentsMeta | null = null;

const useResourceCommentsStore = createSelectors(
  create<ResourceCommentsState>(() => ({
    comments: [],
    busy: false,
    operationError: null,
    hasMore: false,
    nextCursor: null,
    idle: true,
    loading: false,
    error: null,
    deleteCommentData: null,
    commentFormData: null,
  })),
);

const getResourceCommentsStoreMeta = (): ResourceCommentsMeta => {
  if (!resourceStoreMeta) {
    throw new Error("Resource comments store meta not set");
  }
  return resourceStoreMeta;
};

const setResourceCommentsStoreMeta = (meta: ResourceCommentsMeta): void => {
  resourceStoreMeta = meta;
};

export {
  useResourceCommentsStore,
  getResourceCommentsStoreMeta,
  setResourceCommentsStoreMeta,
};
