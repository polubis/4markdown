import { create } from "zustand";
import { JudgementConfiguration } from "../domain/models";

export const createStore = ({
  rating,
  resourceId,
  myCategory = null,
}: JudgementConfiguration) => {
  return create(() => ({
    rating,
    resourceId,
    myCategory,
  }));
};

export type Store = ReturnType<typeof createStore>;
export type State = ReturnType<Store["getState"]>;
