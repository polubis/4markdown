import React, { useEffect } from "react";
import {
  BiError,
  BiPencil,
  BiPlus,
  BiSearch,
  BiTrash,
  BiUser,
  BiUserPlus,
} from "react-icons/bi";
import {
  addAccessGroupAction,
  changeViewAction,
  removeAccessGroupAction,
  startAccessGroupEditAction,
  startAccessGroupMembersEditAction,
} from "../store/actions";
import { Button } from "design-system/button";
import { useAccessGroupsManagementStore } from "../store";
import { getYourAccessGroupsAct } from "../acts/get-your-access-groups.act";
import { Avatar } from "design-system/avatar";
import { formatDistance } from "date-fns";
import { GroupsSkeletonLoader } from "../components/groups-skeleton-loader";
import { MAX_ACCESS_GROUP_MEMBERS } from "../config/constraints";
import { Empty } from "design-system/empty";
import { Err } from "design-system/err";
import { useFeature } from "@greenonsoftware/react-kit";
import { AccessGroupDto, API4MarkdownError } from "api-4markdown-contracts";
import { Modal2 } from "design-system/modal2";
import { useMutation } from "core/use-mutation";
import { removeAccessGroupAct } from "../acts/remove-access-group-act";

const Content = () => {
  const now = new Date();
  const { accessGroups, idle, busy, error } = useAccessGroupsManagementStore();
  const groupToDeleteConfirm = useFeature<AccessGroupDto>();

  const errorModal = useFeature<API4MarkdownError>();

  const removeGroupMutation = useMutation({
    handler: (signal) => {
      groupToDeleteConfirm.off();

      if (groupToDeleteConfirm.is !== "on") {
        throw new Error("No group selected to delete");
      }

      const group = groupToDeleteConfirm.data;

      removeAccessGroupAction(group);

      return removeAccessGroupAct({
        id: group.id,
      }).catch((err) => {
        if (!signal.aborted) {
          addAccessGroupAction(group);
        }
        throw err;
      });
    },
    onFail: (error) => {
      errorModal.on(error);
    },
  });

  if (idle || busy) {
    return <GroupsSkeletonLoader data-testid="[access-groups]:loader" />;
  }

  if (error) {
    return (
      <Err>
        <Err.Icon>
          <BiError size={80} />
        </Err.Icon>
        <Err.Title>Something went wrong!</Err.Title>
        <Err.Description>{error.message}</Err.Description>
        <Err.Action
          title="Retry loading access groups"
          auto
          s={2}
          i={2}
          onClick={getYourAccessGroupsAct}
        >
          Try Again
        </Err.Action>
      </Err>
    );
  }

  if (accessGroups.length === 0) {
    return (
      <Empty id="empty-state">
        <Empty.Icon>
          <BiSearch size={80} />
        </Empty.Icon>
        <Empty.Title id="empty-title">No Access Groups here yet!</Empty.Title>
        <Empty.Description aria-describedby="empty-title">
          Tap Create to make your first
        </Empty.Description>
        <Empty.Action auto onClick={() => changeViewAction("form")} s={2} i={2}>
          <BiPlus /> Create Group
        </Empty.Action>
      </Empty>
    );
  }

  return (
    <>
      {errorModal.is === "on" && (
        <Modal2 onClose={errorModal.off}>
          <Modal2.Header
            title="Error occurred"
            closeButtonTitle="Close error screen"
          />
          <Modal2.Body>
            <Err>
              <Err.Icon>
                <BiError size={80} />
              </Err.Icon>
              <Err.Title>Something went wrong!</Err.Title>
              <Err.Description>{errorModal.data.message}</Err.Description>
            </Err>
          </Modal2.Body>
          <Modal2.Footer className="flex justify-end gap-2">
            <Button i={1} s={2} auto title="Close" onClick={errorModal.off}>
              Close
            </Button>
          </Modal2.Footer>
        </Modal2>
      )}

      {groupToDeleteConfirm.is === "on" && (
        <Modal2 onClose={groupToDeleteConfirm.off}>
          <Modal2.Header
            title="Delete Access Group"
            closeButtonTitle="Cancel delete access group"
          />
          <Modal2.Body>
            <p>
              Are you sure you want to delete the access group{" "}
              <strong>{groupToDeleteConfirm.data.name}</strong>?
            </p>
            <p className="mt-1">
              All members will lose access to all materials shared in this
              access group.
            </p>
          </Modal2.Body>
          <Modal2.Footer className="flex gap-3">
            <Button
              i={1}
              s={2}
              auto
              className="flex-1"
              title="Cancel delete access group"
              onClick={groupToDeleteConfirm.off}
            >
              Cancel
            </Button>
            <Button
              i={2}
              s={2}
              className="flex-1"
              auto
              title="Confirm delete access group"
              onClick={() => removeGroupMutation.start()}
            >
              Confirm
            </Button>
          </Modal2.Footer>
        </Modal2>
      )}
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
              <div className="mr-auto flex items-center gap-1">
                <BiUser />
                <i>
                  {accessGroup.members.length}/{MAX_ACCESS_GROUP_MEMBERS}
                </i>
              </div>
              <Button
                title="Delete access group"
                s={1}
                i={1}
                onClick={() => groupToDeleteConfirm.on(accessGroup)}
              >
                <BiTrash />
              </Button>
              <Button
                title="Add members to access group"
                s={1}
                i={1}
                onClick={() => startAccessGroupMembersEditAction(accessGroup)}
              >
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
    </>
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
          onClick={() => {
            changeViewAction("form");
          }}
        >
          <BiPlus />
        </Button>
      </header>
      <section className="mt-10">
        <Content />
      </section>
    </div>
  );
};

export { GroupsListContainer };
