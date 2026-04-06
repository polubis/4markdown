import { state } from "development-kit/state";
import type { MarkdownPostCreatorState } from "./models";

const useMarkdownPostCreatorState = state<MarkdownPostCreatorState>({
  title: ``,
  content: ``,
});

export { useMarkdownPostCreatorState };
