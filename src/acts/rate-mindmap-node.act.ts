import { getAPI, parseError } from "api-4markdown";
import type {
  API4MarkdownDto,
  API4MarkdownPayload,
} from "api-4markdown-contracts";
import type { AsyncResult } from "development-kit/utility-types";

const rateMindmapNodeAct = async (
  payload: API4MarkdownPayload<"rateMindmapNode">,
): AsyncResult<API4MarkdownDto<"rateMindmapNode">> => {
  try {
    const data = await getAPI().call("rateMindmapNode")(payload);
    return { is: "ok", data };
  } catch (rawError: unknown) {
    const error = parseError(rawError);
    return { is: "fail", error };
  }
};

export { rateMindmapNodeAct };
