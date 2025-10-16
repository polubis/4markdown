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
import { Error } from "design-system/error";
import { useTypeaheadQuery } from "core/use-typeahead-query";
import { findUserProfilesAct } from "../acts/find-user-profiles.act";
import { UserProfileDto } from "api-4markdown-contracts";
import { formatDistance } from "date-fns";
import { Tabs2 } from "design-system/tabs-2";
import { Modal2 } from "design-system/modal2";
import { useFeature } from "@greenonsoftware/react-kit";

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

  const accessGroupToEdit =
    useAccessGroupsManagementStore.use.accessGroupToEdit()!;

  const groupQuery = useQuery({
    handler: () =>
      getAccessGroupAct({
        id: accessGroupToEdit.id,
      }),
  });

  const typeaheadQuery = useTypeaheadQuery<UserProfileDto[]>({
    handler: (query) =>
      findUserProfilesAct({ query, by }).then((result) => result.userProfiles),
  });

  const [selectedUsers, setSelectedUsers] = React.useState<UserProfileDto[]>(
    [],
  );

  const handleUserSelect = (user: any) => {
    const isAlreadySelected = selectedUsers.some(
      (selectedUser) => selectedUser.id === user.id,
    );

    if (!isAlreadySelected) {
      setSelectedUsers((prev) => [...prev, user]);
    }
  };

  return (
    <>
      {revokeAccessConfirm.is === "on" && (
        <Modal2 onClose={revokeAccessConfirm.off}>
          <Modal2.Header
            title="Add Comment"
            closeButtonTitle="Close comment adding"
          />
          <Modal2.Body>Are you sure?</Modal2.Body>
          <Modal2.Footer>
            <Button
              className="ml-auto"
              i={2}
              s={2}
              auto
              title="Confirm comment add"
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

        <Search>
          <Search.Input
            placeholder="Search for users by name, email, or ID..."
            value={typeaheadQuery.query}
            onChange={(e) => typeaheadQuery.start(e.target.value)}
            onClear={typeaheadQuery.abort}
            busy={typeaheadQuery.is === "busy"}
            showClear={!!typeaheadQuery.query}
          />
          <Search.List>
            {(typeaheadQuery.is === "idle" || typeaheadQuery.is === "busy") && (
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
                <Error className="py-4">
                  <Error.Icon>
                    <BiError size={80} />
                  </Error.Icon>
                  <Error.Title>Something went wrong!</Error.Title>
                  <Error.Description className="mb-0">
                    {typeaheadQuery.error.message}
                  </Error.Description>
                </Error>
              </li>
            )}
          </Search.List>
        </Search>

        <div className="mt-10">
          {(groupQuery.is === "idle" || groupQuery.is === "busy") && (
            <SelectedUsersSkeletonLoader />
          )}
          {groupQuery.is === "fail" && (
            <Error>
              <Error.Icon>
                <BiError size={80} />
              </Error.Icon>
              <Error.Title>Something went wrong!</Error.Title>
              <Error.Description>{groupQuery.error.message}</Error.Description>
              <Error.Action
                title="Retry loading access groups"
                auto
                s={2}
                i={2}
                onClick={() => groupQuery.start()}
              >
                Try Again
              </Error.Action>
            </Error>
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

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex max-w-xl space-x-5 ml-auto rounded-lg"
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
                            title="Revert access"
                          >
                            Revert Access
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
