import { useMarkdownPostCreatorState } from ".";
import type { MarkdownPostCreatorState } from "./models";

const { set, getInitial } = useMarkdownPostCreatorState;

const changeTitleAction = (title: MarkdownPostCreatorState["title"]): void => {
  set({ title });
};

const changeContentAction = (
  content: MarkdownPostCreatorState["content"],
): void => {
  set({ content });
};

const resetAction = (): void => {
  set(getInitial());
};

export { changeTitleAction, changeContentAction, resetAction };
