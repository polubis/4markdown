import { state } from "development-kit/state";
import { type ResourceAccessState } from "./models";

const useResourceAccessState = state<ResourceAccessState>({
  loading: true,
  error: null,
  busy: false,
  access: [],
  phrase: "",
});

export { useResourceAccessState };
