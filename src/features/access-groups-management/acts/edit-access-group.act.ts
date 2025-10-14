import { getAPI, parseError } from "api-4markdown";
import { API4MarkdownPayload } from "api-4markdown-contracts";
import { updateAccessGroupAction } from "../store/actions";

const editAccessGroupAct = async (
  payload: API4MarkdownPayload<"editAccessGroup">,
): Promise<void> => {
  const editedGroup = await getAPI().call(`editAccessGroup`)(payload);
  updateAccessGroupAction(editedGroup);
};

export { editAccessGroupAct };
