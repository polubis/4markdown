import { getAPI, parseError } from "api-4markdown";
import { useAssetsManagementStore } from "../store";
import { setAssetsAction } from "../store/actions";

const getYourAssetsAct = async (): Promise<void> => {
  try {
    useAssetsManagementStore.setState({
      busy: true,
      idle: false,
      error: null,
    });

    const assets = await getAPI().call("getYourImages")();

    setAssetsAction(assets);

    useAssetsManagementStore.setState({
      busy: false,
    });
  } catch (error: unknown) {
    useAssetsManagementStore.setState({
      busy: false,
      error: parseError(error),
    });
  }
};

export { getYourAssetsAct };
