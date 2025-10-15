import { getAPI, parseError } from "api-4markdown";
import { useAccessGroupsManagementStore } from "../store";

const getYourAccessGroupsAct = async (): Promise<void> => {
  try {
    useAccessGroupsManagementStore.setState({
      busy: true,
      idle: false,
      error: null,
    });

    const data = await getAPI().call(`getYourAccessGroups`)({
      limit: 10,
      cursor: null,
    });

    useAccessGroupsManagementStore.setState({
      busy: false,
      accessGroups: data.accessGroups,
    });
  } catch (error: unknown) {
    useAccessGroupsManagementStore.setState({
      busy: false,
      error: parseError(error),
    });
  }
};

export { getYourAccessGroupsAct };
