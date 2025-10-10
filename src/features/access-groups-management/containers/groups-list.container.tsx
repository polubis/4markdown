import React, { useEffect } from "react";
import { BiPlus } from "react-icons/bi";
import { changeViewAction } from "../store/actions";
import { Button } from "design-system/button";
import { useAccessGroupsManagementStore } from "../store";
import { Loader } from "design-system/loader";
import { getYourAccessGroupsAct } from "../acts/get-your-access-groups.act";

const Content = () => {
  const { accessGroups, idle, busy, error } = useAccessGroupsManagementStore();

  if (idle || busy) {
    return <Loader data-testid="[access-groups]:loader" size="xl" />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center max-w-md">
        <h6 className="text-xl text-center">{error.message}</h6>
        <Button
          title="Go to document creator"
          className="mt-4"
          auto
          s={2}
          i={2}
          onClick={getYourAccessGroupsAct}
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (accessGroups.length === 0) {
    return (
      <div className="flex flex-col items-center max-w-md">
        <p className="text-xl text-center">No access groups found</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl w-full">
      <h1 className="text-2xl font-bold mb-5">Access groups</h1>
      <section className="mt-10 max-w-7xl w-full">
        <ul className="columns-1 md:columns-2 lg:columns-3 gap-4 [column-fill:_balance]">
          {accessGroups.map((accessGroup) => (
            <li
              key={accessGroup.id}
              className="break-inside-avoid mb-4 p-4 flex flex-col rounded-lg border border-zinc-300 dark:border-zinc-800"
            >
              <h2 className="text-lg font-bold leading-6 mb-1">
                {accessGroup.name}
              </h2>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

const GroupsListContainer = () => {
  useEffect(() => {
    getYourAccessGroupsAct();
  }, []);

  return (
    <>
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Access groups</h1>
        <Button
          i={2}
          s={2}
          title="Create group"
          auto
          onClick={() => {
            changeViewAction("create");
          }}
        >
          <BiPlus />
          Create
        </Button>
      </header>
      <section className="mt-10">
        <Content />
      </section>
    </>
  );
};

export { GroupsListContainer };
