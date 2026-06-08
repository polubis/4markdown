import { parseError } from "api-4markdown";
import { getComments as getCommentsApi } from "../../integration/api";
import { type Store } from "../store";

export const loadComments = (store: Store) => async () => {
  try {
    const { resourceId, resouceType } = store.getState();

    store.setState({ comments: { is: "busy" } });

    const data = await getCommentsApi(resourceId, resouceType);
    store.setState({ comments: { is: "ok", data } });
  } catch (error) {
    store.setState({ comments: { is: "fail", error: parseError(error) } });
  }
};
