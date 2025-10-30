import { useResourceCommentsStore } from ".";
import { ResourceCommentsState } from "../models";

const setAction = <TKey extends keyof ResourceCommentsState>(
  key: TKey,
  value: ResourceCommentsState[TKey],
): void => {
  useResourceCommentsStore.setState((state) => ({
    ...state,
    [key]: value,
  }));
};

export { setAction };
