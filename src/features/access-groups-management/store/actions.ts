import { AccessGroupDto } from "api-4markdown-contracts";
import { useAccessGroupsManagementStore } from ".";

const changeViewAction = (view: "list" | "create"): void => {
  useAccessGroupsManagementStore.setState({ view });
};

const addAccessGroupAction = (accessGroup: AccessGroupDto): void => {
  useAccessGroupsManagementStore.setState((prevState) => ({
    ...prevState,
    accessGroups: [...prevState.accessGroups, accessGroup],
  }));
};

export { changeViewAction, addAccessGroupAction };
