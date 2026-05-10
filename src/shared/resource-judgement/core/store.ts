import { create } from "zustand";
import { JudgementConfiguration } from "../domain/models";

export const createStore = ({ rating }: JudgementConfiguration) => {
  return create(() => ({
    rating,
  }));
};

export type Store = ReturnType<typeof createStore>;
export type State = ReturnType<Store["getState"]>;
