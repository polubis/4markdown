import {
  API4MarkdownContractKey,
  API4MarkdownDto,
  API4MarkdownPayload,
} from "api-4markdown-contracts";
import { getAPI, getCache, parseError, setCache } from "api-4markdown";
import { AsyncResult } from "development-kit/utility-types";

const toggleResourceCompletionAct = async (
  payload: API4MarkdownPayload<"setUserResourceCompletion">,
): AsyncResult<API4MarkdownDto<"setUserResourceCompletion">> => {
  try {
    const key: API4MarkdownContractKey = "setUserResourceCompletion";

    const dto = await getAPI().call(key)(payload);

    setCache(key, dto);

    return {
      is: `ok`,
      data: dto,
    };
  } catch (error) {
    return {
      is: `fail`,
      error: parseError(error),
    };
  }
};

export { toggleResourceCompletionAct };
