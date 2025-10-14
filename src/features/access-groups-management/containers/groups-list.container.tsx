import React, { useEffect } from "react";
import { BiPencil, BiPlus, BiUserPlus } from "react-icons/bi";
import { changeViewAction, startAccessGroupEditAction } from "../store/actions";
import { Button } from "design-system/button";
import { useAccessGroupsManagementStore } from "../store";
import { getYourAccessGroupsAct } from "../acts/get-your-access-groups.act";
import { Avatar } from "design-system/avatar";
import { formatDistance } from "date-fns";
import { GroupsSkeletonLoader } from "../components/groups-skeleton-loader";
import { Skeleton } from "design-system/skeleton";

const Content = () => {
  const now = new Date();
  const { accessGroups, idle, busy, error } = useAccessGroupsManagementStore();

  if (idle || busy) {
    return <GroupsSkeletonLoader data-testid="[access-groups]:loader" />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center max-w-md mx-auto animate-fade-in">
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
      <div className="flex flex-col items-center max-w-md mx-auto animate-fade-in">
        <p className="text-xl text-center">No access groups found</p>
      </div>
    );
  }

  return (
    <ul className="columns-1 md:columns-2 lg:columns-3 gap-4 [column-fill:_balance] animate-fade-in">
      {accessGroups.map((accessGroup) => (
        <li
          key={accessGroup.id}
          className="break-inside-avoid mb-4 p-4 flex flex-col rounded-lg border border-zinc-300 dark:border-zinc-800"
        >
          <div className="flex items-center gap-4">
            <Avatar
              size="md"
              alt={accessGroup.name}
              char={accessGroup.name.charAt(0)}
              className="shrink-0 bg-gray-300 dark:bg-slate-800"
            />
            <div className="flex flex-col">
              <p className="text-lg font-bold leading-6 mb-1">
                {accessGroup.name}
              </p>

              <p className="text-sm">
                Updated{" "}
                {formatDistance(now, accessGroup.mdate, {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
          {accessGroup.description && (
            <p className=" mt-4">{accessGroup.description}</p>
          )}
          <div className="mt-4 flex items-center justify-end gap-1">
            <div className="mr-auto flex items-center">
              <i>24/200 members in total</i>
            </div>
            <Button title="Add members to access group" s={1} i={1}>
              <BiUserPlus />
            </Button>
            <Button
              title="Edit access group"
              s={1}
              i={1}
              onClick={() => startAccessGroupEditAction(accessGroup)}
            >
              <BiPencil />
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
};

const GroupsListContainer = () => {
  useEffect(() => {
    getYourAccessGroupsAct();
  }, []);

  return (
    <div className="max-w-6xl w-full mx-auto animate-fade-in">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Access Groups</h1>
        <Button
          i={2}
          s={2}
          title="Create group"
          auto
          onClick={() => {
            changeViewAction("form");
          }}
        >
          <BiPlus />
          Create
        </Button>
      </header>
      <section className="mt-10">
        <Content />
      </section>
    </div>
  );
};

export { GroupsListContainer };
