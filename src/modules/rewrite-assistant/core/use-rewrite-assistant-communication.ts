import type { RewriteAssistantPersona } from 'api-4markdown-contracts';
import { useRewriteAssistantContext } from '../providers/rewrite-assistant.provider';
import { parseError } from 'api-4markdown';

const useRewriteAssistantCommunication = () => {
  const assistantCtx = useRewriteAssistantContext();

  const triggerAssistant = async (): Promise<void> => {
    try {
      const responseContent = await new Promise<string>((resolve, reject) => {
        setTimeout(async () => {
          try {
            const response = await fetch(`/intro.md`);
            const content = await response.text();
            return resolve(content);
          } catch (error: unknown) {
            return reject(error);
          }
        }, 1000);
      });

      assistantCtx.dispatch({ type: `set-ok`, payload: responseContent });
    } catch (error) {
      assistantCtx.dispatch({ type: `set-fail`, payload: parseError(error) });
    }
  };

  const askAssistant = async (
    persona: RewriteAssistantPersona,
  ): Promise<void> => {
    assistantCtx.dispatch({ type: `select-persona`, payload: persona });
    triggerAssistant();
  };

  const askAssistantAgain = (): void => {
    if (assistantCtx.state.activePersona === `none`) {
      throw new Error(`No persona selected`);
    }

    assistantCtx.dispatch({
      type: `ask-again`,
      payload: assistantCtx.state.activePersona,
    });

    triggerAssistant();
  };

  return { askAssistantAgain, askAssistant };
};

export { useRewriteAssistantCommunication };
