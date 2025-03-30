import { parseError } from 'api-4markdown';
import type { API4MarkdownPayload } from 'api-4markdown-contracts';
import type { AsyncResult } from 'development-kit/utility-types';
import { mock } from 'development-kit/mock';

const rateApplicationAct = async (
  payload: API4MarkdownPayload<'rateApplication'>,
): AsyncResult => {
  try {
    await mock({
      delay: 1,
      errorFactor: 20,
      error: () => new Error(`Failed to rate application`),
    })({ success: true })(payload);

    return { is: `ok` };
  } catch (rawError: unknown) {
    const error = parseError(rawError);
    return { is: `fail`, error };
  }
};

export { rateApplicationAct };
