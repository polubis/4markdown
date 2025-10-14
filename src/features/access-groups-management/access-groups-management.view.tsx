import React from "react";
import { useAccessGroupsManagementStore } from "./store";
import { GroupsListContainer } from "./containers/groups-list.container";
import { useAuthStore } from "store/auth/auth.store";
import { Loader } from "design-system/loader";
import { AccessGroupFormContainer } from "./containers/access-group-form.container";

const ViewsManager = () => {
  const view = useAccessGroupsManagementStore.use.view();

  if (view === "list") {
    return <GroupsListContainer />;
  }

  return <AccessGroupFormContainer />;
};

const AccessGroupsManagementView = () => {
  const auth = useAuthStore();

  return (
    <main className="flex flex-col min-h-[calc(100svh-72px)] py-10 px-4">
      {auth.is === `idle` && (
        <Loader
          data-testid="[access-groups]:loader"
          className="m-auto"
          size="xl"
        />
      )}
      {auth.is === `unauthorized` && (
        <h1 className="text-2xl m-auto text-center">
          Resource Not Found at the Specified URL
        </h1>
      )}
      {auth.is === `authorized` && <ViewsManager />}
    </main>
  );
};

export { AccessGroupsManagementView };
