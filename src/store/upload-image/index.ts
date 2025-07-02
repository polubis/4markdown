import { state } from "development-kit/state";
import type { UploadImageState } from "./models";

const useUploadImageState = state<UploadImageState>({ is: `idle` });

export { useUploadImageState };
