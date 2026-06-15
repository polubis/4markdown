import { Configuration } from "../domain/models";
import { createBus } from "./bus";
import { createFacade } from "./facade";
import { createStore } from "./store";

export const createMediator = (config: Configuration) => {
  const useStore = createStore(config);
  const bus = createBus();
  return createFacade(useStore, bus);
};
