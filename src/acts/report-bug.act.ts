import { getAPI, parseError } from 'api-4markdown';
import type { API4MarkdownPayload } from 'api-4markdown-contracts';
import type { AsyncResult } from 'development-kit/utility-types';

const reportBugAct = async (
  payload: API4MarkdownPayload<'reportBug'>,
): AsyncResult => {
  try {
    await getAPI().call(`reportBug`)(payload);
    return { is: `ok` };
  } catch (rawError: unknown) {
    const error = parseError(rawError);
    return { is: `fail`, error };
  }
};

export { reportBugAct };
