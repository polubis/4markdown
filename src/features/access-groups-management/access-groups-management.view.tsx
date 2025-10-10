import React from "react";
import { useAccessGroupsManagementStore } from "./store";
import { GroupsListContainer } from "./containers/groups-list.container";
import { NewGroupContainer } from "./containers/new-group.container";

const ViewsManager = () => {
  const view = useAccessGroupsManagementStore.use.view();

  if (view === "list") {
    return <GroupsListContainer />;
  }

  return <NewGroupContainer />;
};

const AccessGroupsManagementView = () => {
  return (
    <main className="flex flex-col min-h-[calc(100svh-72px)] py-10 px-4">
      <ViewsManager />
    </main>
  );
};

export { AccessGroupsManagementView };
