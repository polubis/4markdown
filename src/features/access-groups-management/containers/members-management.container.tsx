import React from "react";
import { BiArrowToLeft, BiUser, BiError } from "react-icons/bi";
import { Button } from "design-system/button";
import { Search } from "design-system/search-input";
import { Empty } from "design-system/empty";
import { Avatar } from "design-system/avatar";
import { UserSocials } from "components/user-socials";
import { useAccessGroupsManagementStore } from "../store";
import { changeViewAction } from "../store/actions";
import { MAX_ACCESS_GROUP_MEMBERS } from "../config/constraints";
import { SelectedUsersSkeletonLoader } from "../components/selected-users-skeleton-loader";
import { useQuery } from "core/use-query";
import { getAccessGroupAct } from "../acts/get-access-group.act";
import { Err } from "design-system/err";
import { useTypeaheadQuery } from "core/use-typeahead-query";
import { findUserProfilesAct } from "../acts/find-user-profiles.act";
import {
  API4MarkdownDto,
  API4MarkdownError,
  UserProfileDto,
  UserProfileId,
} from "api-4markdown-contracts";
import { formatDistance } from "date-fns";
import { Tabs2 } from "design-system/tabs-2";
import { Modal2 } from "design-system/modal2";
import { useFeature } from "@greenonsoftware/react-kit";
import { useMutation } from "core/use-mutation";
import { addAccessGroupMemberAct } from "../acts/add-access-group-member.act";
import { removeAccessGroupMemberAct } from "../acts/remove-access-group-member.act";
import { SUID, suid } from "development-kit/suid";
import { Field } from "design-system/field";
import { Hint } from "design-system/hint";

const UserSearchItem = ({ user }: { user: UserProfileDto }) => {
  return (
    <>
      <div className="flex-shrink-0">
        <Avatar
          size="sm"
          src={user.avatar?.sm.src}
          char={user.displayName ? user.displayName.charAt(0) : undefined}
          alt={user.displayName || user.id}
          title={user.displayName || user.id}
          className="bg-gray-300 dark:bg-slate-800"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white truncate pb-0.5">
          {user.displayName || user.id}
        </p>
        {user.bio && (
          <p className="text-sm text-gray-500 dark:text-gray-400 pb-0.5">
            {user.bio}
          </p>
        )}
        <p className="text-xs text-gray-400 dark:text-gray-500">
          ID: {user.id}
        </p>
      </div>
    </>
  );
};

const MembersManagementContainer = () => {
  const [by, setBy] = React.useState<"displayName" | "id">("displayName");

  const revokeAccessConfirm = useFeature<UserProfileDto>();

  const errorModal = useFeature<API4MarkdownError>();

  const accessGroupToEdit =
    useAccessGroupsManagementStore.use.accessGroupToEdit()!;

  const addMemberToGroupMutation = useMutation<
    API4MarkdownDto<"addAccessGroupMember">
  >({
    onFail: (error) => {
      errorModal.on(error);
    },
  });

  const removeAccessMutation = useMutation<
    API4MarkdownDto<"removeAccessGroupMember">
  >({
    handler: (signal) => {
      if (revokeAccessConfirm.is !== "on") {
        throw new Error("No user selected to remove");
      }

      if (groupQuery.is !== "ok") {
        throw new Error("Group data not loaded");
      }

      const memberToRemove = selectedUsers.find(
        (u) => u.id === revokeAccessConfirm.data.id,
      );

      if (!memberToRemove) {
        throw new Error("Member not found");
      }

      revokeAccessConfirm.off();

      setSelectedUsers((prev) =>
        prev.filter((u) => u.id !== memberToRemove.id),
      );

      return removeAccessGroupMemberAct({
        id: groupQuery.data.id,
        memberProfileId: revokeAccessConfirm.data.id as UserProfileId,
        etag: groupQuery.data.etag,
      })
        .then((res) => {
          if (!signal.aborted) {
            groupQuery.setData({
              etag: res.etag,
              mdate: res.mdate,
              members: groupQuery.data.members.filter(
                (u) => u.id !== memberToRemove.id,
              ),
            });
          }
          return res;
        })
        .catch((err) => {
          if (!signal.aborted) {
            setSelectedUsers((prev) => [...prev, memberToRemove]);
          }

          throw err;
        });
    },
    onFail: (error) => {
      errorModal.on(error);
    },
  });

  const typeaheadQuery = useTypeaheadQuery<UserProfileDto[]>({
    handler: (query) =>
      findUserProfilesAct({ query, by }).then((result) => result.userProfiles),
  });

  const [selectedUsers, setSelectedUsers] = React.useState<
    (UserProfileDto & { clientId?: SUID })[]
  >([]);

  const groupQuery = useQuery({
    handler: () =>
      getAccessGroupAct({
        id: accessGroupToEdit.id,
      }),
    onOk: (data) => {
      setSelectedUsers(data.members);
    },
  });

  const handleUserSelect = (user: UserProfileDto) => {
    const clientId = suid();

    setSelectedUsers((prev) => [
      ...prev,
      {
        ...user,
        clientId,
      },
    ]);

    addMemberToGroupMutation.start((signal) => {
      if (groupQuery.is !== "ok") {
        throw new Error("Group data not loaded");
      }

      return addAccessGroupMemberAct({
        id: groupQuery.data.id,
        memberProfileId: user.id as UserProfileId,
        etag: groupQuery.data.etag,
      })
        .then((res) => {
          if (!signal.aborted) {
            groupQuery.setData({
              etag: res.etag,
              mdate: res.mdate,
              members: [...groupQuery.data.members, res.member],
            });
          }
          return res;
        })
        .catch((error) => {
          if (!signal.aborted) {
            setSelectedUsers((prev) =>
              prev.filter((u) => u.clientId !== clientId),
            );
          }
          throw error;
        });
    });
  };

  return (
    <>
      {errorModal.is === "on" && (
        <Modal2 onClose={errorModal.off}>
          <Modal2.Header
            title="Error occurred"
            closeButtonTitle="Close error screen"
          />
          <Modal2.Body>
            <Err className="py-4">
              <Err.Icon>
                <BiError size={80} />
              </Err.Icon>
              <Err.Title>Ups! Something went wrong</Err.Title>
              <Err.Description
                className={
                  errorModal.data.symbol === "out-of-date" ? "mt-0" : ""
                }
              >
                {errorModal.data.symbol === "out-of-date" ? (
                  <>
                    You're trying to modify group that has been changed by you
                    on another device. Refresh group data with button below and
                    try again.
                  </>
                ) : (
                  <>{errorModal.data.message}</>
                )}
              </Err.Description>
              {errorModal.data.symbol === "out-of-date" && (
                <Err.Action
                  title="Reload Group Data"
                  auto
                  s={2}
                  i={2}
                  onClick={() => {
                    errorModal.off();
                    groupQuery.start();
                  }}
                >
                  Reload Group Data
                </Err.Action>
              )}
            </Err>
          </Modal2.Body>
          <Modal2.Footer className="flex justify-end gap-2">
            <Button i={1} s={2} auto title="Close" onClick={errorModal.off}>
              Close
            </Button>
          </Modal2.Footer>
        </Modal2>
      )}
      {revokeAccessConfirm.is === "on" && (
        <Modal2 onClose={revokeAccessConfirm.off}>
          <Modal2.Header
            title="Revoke Access"
            closeButtonTitle="Close revoke access"
          />
          <Modal2.Body>
            <p>
              Are you sure you want to revoke access to{" "}
              <strong>
                {revokeAccessConfirm.data.displayName ??
                  revokeAccessConfirm.data.id}
              </strong>{" "}
              user?
            </p>
            <p className="mt-1">
              He will lose access to all materials shared in this access group.
              You can add this user back later.
            </p>
          </Modal2.Body>
          <Modal2.Footer className="flex gap-3">
            <Button
              i={1}
              s={2}
              auto
              className="flex-1"
              title="Cancel revoke access"
              onClick={revokeAccessConfirm.off}
            >
              Cancel
            </Button>
            <Button
              i={2}
              s={2}
              auto
              className="flex-1"
              title="Confirm revoke access"
              onClick={() => removeAccessMutation.start()}
            >
              Confirm
            </Button>
          </Modal2.Footer>
        </Modal2>
      )}

      <div className="max-w-6xl w-full mx-auto animate-fade-in">
        <header className="mb-10">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => changeViewAction("list")}
              i={1}
              s={1}
              title="Back to groups"
            >
              <BiArrowToLeft />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">
                Manage Members - "{accessGroupToEdit.name}"
              </h1>
              <p className="text-sm pt-1.5">
                You can add up to {MAX_ACCESS_GROUP_MEMBERS} members to the
                group
              </p>
            </div>
          </div>
        </header>

        <Tabs2 className="mb-4">
          <Tabs2.Item
            active={by === "displayName"}
            title="Search"
            onClick={() => {
              setBy("displayName");
              typeaheadQuery.abort(true);
            }}
          >
            By Display Name
          </Tabs2.Item>
          <Tabs2.Item
            active={by === "id"}
            title="Search"
            onClick={() => {
              setBy("id");
              typeaheadQuery.abort(true);
            }}
          >
            By User ID
          </Tabs2.Item>
        </Tabs2>

        <Field
          hint={
            <Hint trigger="Remember, the provided value must exactly match the user's display name or ID" />
          }
        >
          <Search>
            <Search.Input
              placeholder={
                by === "displayName"
                  ? "Search for users by display name"
                  : "Search for users by ID"
              }
              value={typeaheadQuery.query}
              onChange={(e) => typeaheadQuery.start(e.target.value)}
              onClear={typeaheadQuery.abort}
              busy={typeaheadQuery.is === "busy"}
              showClear={!!typeaheadQuery.query}
            />
            <Search.List>
              {(typeaheadQuery.is === "idle" ||
                typeaheadQuery.is === "busy") && (
                <li>
                  <Empty className="py-4">
                    <Empty.Icon>
                      <BiUser size={80} />
                    </Empty.Icon>
                    <Empty.Title>Type to search for users</Empty.Title>
                    <Empty.Description className="mb-0">
                      Type at least 2 characters to search for users
                    </Empty.Description>
                  </Empty>
                </li>
              )}

              {typeaheadQuery.is === "ok" && (
                <>
                  {typeaheadQuery.data.length > 0 ? (
                    typeaheadQuery.data.map((user) => (
                      <Search.ListItem
                        key={user.id}
                        onClick={() => handleUserSelect(user)}
                      >
                        <UserSearchItem user={user} />
                      </Search.ListItem>
                    ))
                  ) : (
                    <li>
                      <Empty className="py-4">
                        <Empty.Icon>
                          <BiUser size={80} />
                        </Empty.Icon>
                        <Empty.Title>No users found</Empty.Title>
                        <Empty.Description className="mb-0">
                          No users found matching your search criteria
                        </Empty.Description>
                      </Empty>
                    </li>
                  )}
                </>
              )}
              {typeaheadQuery.is === "fail" && (
                <li>
                  <Err className="py-4">
                    <Err.Icon>
                      <BiError size={80} />
                    </Err.Icon>
                    <Err.Title>Something went wrong!</Err.Title>
                    <Err.Description className="mb-0">
                      {typeaheadQuery.error.message}
                    </Err.Description>
                  </Err>
                </li>
              )}
            </Search.List>
          </Search>
        </Field>

        <div className="mt-10">
          {(groupQuery.is === "idle" || groupQuery.is === "busy") && (
            <SelectedUsersSkeletonLoader />
          )}
          {groupQuery.is === "fail" && (
            <Err>
              <Err.Icon>
                <BiError size={80} />
              </Err.Icon>
              <Err.Title>Something went wrong!</Err.Title>
              <Err.Description>{groupQuery.error.message}</Err.Description>
              <Err.Action
                title="Retry loading access groups"
                auto
                s={2}
                i={2}
                onClick={() => groupQuery.start()}
              >
                Try Again
              </Err.Action>
            </Err>
          )}
          {groupQuery.is === "ok" && (
            <>
              {selectedUsers.length > 0 ? (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Selected Users ({selectedUsers.length})
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {selectedUsers.map((user) => (
                      <div
                        key={user.clientId ?? user.id}
                        className="flex max-w-xl space-x-5 rounded-lg"
                      >
                        <Avatar
                          className="shrink-0 bg-gray-300 dark:bg-slate-800"
                          size="md"
                          src={user.avatar?.md?.src}
                          alt="Selected user avatar"
                          char={user.displayName?.charAt(0) || "?"}
                        />
                        <div className="flex flex-col">
                          <i>
                            Edited{` `}
                            {formatDistance(new Date(), user.mdate, {
                              addSuffix: true,
                            })}
                            {` `}
                            ago
                          </i>
                          <p className="mb-2 text-black dark:text-white font-bold w-fit">
                            {user.displayName || user.id}
                          </p>
                          {user.bio && <p>{user.bio}</p>}
                          <div className="flex space-x-2 mt-4 mb-4">
                            <UserSocials
                              githubUrl={user.githubUrl}
                              linkedInUrl={user.linkedInUrl}
                              blogUrl={user.blogUrl}
                              twitterUrl={user.twitterUrl}
                              fbUrl={user.fbUrl}
                              createTitle={(title) => `User ${title}`}
                            />
                          </div>
                          <Button
                            className="mr-auto"
                            onClick={() => revokeAccessConfirm.on(user)}
                            s={1}
                            i={2}
                            auto
                            title="Revoke access"
                          >
                            Revoke Access
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <Empty>
                  <Empty.Icon>
                    <BiUser size={80} />
                  </Empty.Icon>
                  <Empty.Title>No users in this access group</Empty.Title>
                  <Empty.Description>
                    Search and select users to add them to the group
                  </Empty.Description>
                </Empty>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export { MembersManagementContainer };
