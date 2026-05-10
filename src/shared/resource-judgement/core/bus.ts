import { Subject } from "rxjs";
import { BusEvent } from "../domain/models";

export const createBus = () => {
  return new Subject<BusEvent>();
};

export type Bus = ReturnType<typeof createBus>;
