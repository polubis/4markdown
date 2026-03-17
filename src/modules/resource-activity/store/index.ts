import { state } from "development-kit/state";
import type { ResourceActivityState } from "./models";

const useResourceActivityState = state<ResourceActivityState>({
  is: `idle`,
});

export { useResourceActivityState };
