import { AccessGroupDto } from "api-4markdown-contracts";
import { useAccessGroupsManagementStore } from ".";
import { AccessGroupsManagementState } from "./models";

const changeViewAction = (view: AccessGroupsManagementState["view"]): void => {
  useAccessGroupsManagementStore.setState({ view, accessGroupToEdit: null });
};

const addAccessGroupAction = (accessGroup: AccessGroupDto): void => {
  useAccessGroupsManagementStore.setState((prevState) => ({
    ...prevState,
    accessGroups: [...prevState.accessGroups, accessGroup],
  }));
};

const updateAccessGroupAction = (
  accessGroup: Partial<AccessGroupDto>,
): void => {
  useAccessGroupsManagementStore.setState((prevState) => ({
    ...prevState,
    accessGroups: prevState.accessGroups.map((group) =>
      group.id === accessGroup.id ? { ...accessGroup, ...group } : group,
    ),
  }));
};

const startAccessGroupEditAction = (accessGroup: AccessGroupDto): void => {
  useAccessGroupsManagementStore.setState({
    accessGroupToEdit: accessGroup,
    view: "form",
  });
};

export {
  changeViewAction,
  addAccessGroupAction,
  startAccessGroupEditAction,
  updateAccessGroupAction,
};
