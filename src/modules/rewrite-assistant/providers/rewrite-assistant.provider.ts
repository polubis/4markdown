import { context } from '@greenonsoftware/react-kit';
import { useRewriteAssistantState } from '../core/use-rewrite-assistant-state';

const [RewriteAssistantProvider, useRewriteAssistantContext] = context(
  ({ content, onClose }: { content: string; onClose(): void }) => {
    const { state, dispatch } = useRewriteAssistantState();

    return {
      state,
      content,
      close: onClose,
      dispatch,
    };
  },
);

export { RewriteAssistantProvider, useRewriteAssistantContext };
