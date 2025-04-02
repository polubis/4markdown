import { context } from '@greenonsoftware/react-kit';
import { useRewriteAssistant } from '../core/use-rewrite-assistant';

const [RewriteAssistantProvider, useRewriteAssistantContext] = context(
  ({ content, onClose }: { content: string; onClose(): void }) => {
    const { state, dispatch } = useRewriteAssistant();

    return {
      state,
      content,
      close: onClose,
      dispatch,
    };
  },
);

export { RewriteAssistantProvider, useRewriteAssistantContext };
