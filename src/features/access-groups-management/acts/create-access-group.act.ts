import { getAPI, parseError } from "api-4markdown";
import { API4MarkdownPayload } from "api-4markdown-contracts";
import { AsyncResult } from "development-kit/utility-types";
import { addAccessGroupAction } from "../store/actions";

const createAccessGroupAct = async ({
  name,
  description,
}: API4MarkdownPayload<"createAccessGroup">): AsyncResult => {
  try {
    const createdGroup = await getAPI().call(`createAccessGroup`)({
      name,
      description,
    });

    addAccessGroupAction(createdGroup);

    return { is: `ok` };
  } catch (error) {
    return { is: `fail`, error: parseError(error) };
  }
};

export { createAccessGroupAct };
