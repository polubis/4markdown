import { rateDocument } from "./handlers/rate-document";
import { Store } from "./store";
import { Bus } from "./bus";
import { BusEvent } from "../domain/models";

export const createFacade = (useStore: Store, bus: Bus) => {
  return {
    rateDocument: rateDocument(useStore, bus),
    useRating: () => useStore((state) => state.rating),
    onBusEvent: (onEvent: (event: BusEvent) => void) => bus.subscribe(onEvent),
  };
};

export type Facade = ReturnType<typeof createFacade>;
