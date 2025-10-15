import React, { useState, useRef } from "react";
import { BiArrowToLeft, BiX, BiUser, BiError } from "react-icons/bi";
import { Button } from "design-system/button";
import { SearchInput } from "design-system/search-input";
import { Empty } from "design-system/empty";
import { useAccessGroupsManagementStore } from "../store";
import { changeViewAction } from "../store/actions";
import { MAX_ACCESS_GROUP_MEMBERS } from "../config/constraints";
import { SelectedUsersSkeletonLoader } from "../components/selected-users-skeleton-loader";
import { useQuery } from "core/use-query";
import { getAccessGroupAct } from "../acts/get-access-group.act";
import { Error } from "design-system/error";

// Dummy user data for search
const dummyUsers = [
  {
    id: "user1",
    displayName: "John Doe",
    email: "john.doe@example.com",
    avatar: null,
  },
  {
    id: "user2",
    displayName: "Jane Smith",
    email: "jane.smith@example.com",
    avatar: null,
  },
  {
    id: "user3",
    displayName: "Bob Johnson",
    email: "bob.johnson@example.com",
    avatar: null,
  },
  {
    id: "user4",
    displayName: "Alice Brown",
    email: "alice.brown@example.com",
    avatar: null,
  },
  {
    id: "user5",
    displayName: "Charlie Wilson",
    email: "charlie.wilson@example.com",
    avatar: null,
  },
  {
    id: "user6",
    displayName: "Diana Prince",
    email: "diana.prince@example.com",
    avatar: null,
  },
  {
    id: "user7",
    displayName: "Eve Adams",
    email: "eve.adams@example.com",
    avatar: null,
  },
  {
    id: "user8",
    displayName: "Frank Miller",
    email: "frank.miller@example.com",
    avatar: null,
  },
];

const MembersManagementContainer = () => {
  const accessGroupToEdit =
    useAccessGroupsManagementStore.use.accessGroupToEdit()!;

  const groupQuery = useQuery({
    handler: () =>
      getAccessGroupAct({
        id: accessGroupToEdit.id,
      }),
  });

  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleUserSelect = (user: any) => {
    // Check if user is already selected
    const isAlreadySelected = selectedUsers.some(
      (selectedUser) => selectedUser.id === user.id,
    );

    if (!isAlreadySelected) {
      setSelectedUsers((prev) => [...prev, user]);
    }
  };

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers((prev) => prev.filter((user) => user.id !== userId));
  };

  const handleClearAllSelections = () => {
    setSelectedUsers([]);
  };

  return (
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
              You can add up to {MAX_ACCESS_GROUP_MEMBERS} members to the group
            </p>
          </div>
        </div>
      </header>

      <SearchInput
        ref={searchRef}
        placeholder="Search for users by name, email, or ID..."
        items={dummyUsers}
        onSelect={handleUserSelect}
        noResultsText="No users found matching your search"
        maxHeight="max-h-80"
      />

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
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Selected Users ({selectedUsers.length})
                  </h3>
                  <button
                    onClick={handleClearAllSelections}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  >
                    Clear All
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {selectedUsers.map((user) => (
                    <div
                      key={user.id}
                      className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {user.displayName?.charAt(0)?.toUpperCase() ||
                            user.name?.charAt(0)?.toUpperCase() ||
                            "?"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-blue-900 dark:text-blue-100 truncate">
                            {user.displayName || user.name || user.id}
                          </p>
                          {user.email && (
                            <p className="text-sm text-blue-700 dark:text-blue-300 truncate">
                              {user.email}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemoveUser(user.id)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
                        >
                          <BiX className="h-4 w-4" />
                        </button>
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
  );
};

export { MembersManagementContainer };
