import { JudgementConfiguration } from "../domain/models";
import { createBus } from "./bus";
import { createFacade } from "./facade";
import { createStore } from "./store";

export const createMediator = (config: JudgementConfiguration) => {
  const useStore = createStore(config);
  const bus = createBus();
  const facade = createFacade(useStore, bus);

  return facade;
};

export type Mediator = ReturnType<typeof createMediator>;
