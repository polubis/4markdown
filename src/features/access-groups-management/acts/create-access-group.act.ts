import { getAPI } from "api-4markdown";
import { API4MarkdownPayload } from "api-4markdown-contracts";
import { addAccessGroupAction } from "../store/actions";

const createAccessGroupAct = async (
  payload: API4MarkdownPayload<"createAccessGroup">,
): Promise<void> => {
  const createdGroup = await getAPI().call(`createAccessGroup`)(payload);
  addAccessGroupAction(createdGroup);
};

export { createAccessGroupAct };
