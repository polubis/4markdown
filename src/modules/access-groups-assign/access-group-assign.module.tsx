import { Button } from "design-system/button";
import React from "react";
import { BiError, BiPlusCircle, BiGroup, BiUser } from "react-icons/bi";

import { Loader } from "design-system/loader";
import { Modal2 } from "design-system/modal2";
import { Empty } from "design-system/empty";
import { Error as ErrorComponent } from "design-system/error";
import { navigate } from "gatsby";
import { meta } from "../../../meta";
import { useQuery } from "core/use-query";
import { Search } from "design-system/search-input";
import { getYourAccessGroupsAct } from "./acts/get-your-access-groups.act";
import { AccessGroupId, API4MarkdownDto } from "api-4markdown-contracts";
import { formatDistance } from "date-fns";
import { Avatar } from "design-system/avatar";
import { c } from "design-system/c";

type AccessGroupsAssignModuleProps = {
  accessGroups?: AccessGroupId[];
  disabled: boolean;
  onClose(): void;
  onBack(): void;
  onConfirm(accessGroups: AccessGroupId[]): void;
};

const AccessGroupsAssignModule = ({
  accessGroups,
  disabled,
  onBack,
  onClose,
  onConfirm,
}: AccessGroupsAssignModuleProps) => {
  const groupsQuery = useQuery<API4MarkdownDto<"getYourAccessGroups">>({
    handler: () => getYourAccessGroupsAct(),
  });

  const [now] = React.useState(() => new Date());

  const [selectedGroups, setSelectedGroups] = React.useState<
    Set<AccessGroupId>
  >(() => new Set(accessGroups || []));

  const [query, setQuery] = React.useState("");

  const loadingGroups = groupsQuery.is === "idle" || groupsQuery.is === "busy";

  const filteredGroups = React.useMemo(() => {
    if (groupsQuery.is !== "ok") return [];

    const lowerCaseQuery = query.toLowerCase();

    return groupsQuery.data.accessGroups.filter((group) =>
      group.name.toLowerCase().includes(lowerCaseQuery),
    );
  }, [query, groupsQuery]);

  return (
    <Modal2 disabled={disabled} onClose={onClose}>
      <Modal2.Header
        title="Manual Visibility Management"
        closeButtonTitle="Close manual visibility management"
      />
      <Modal2.Body>
        {loadingGroups && <Loader className="mx-auto" size="lg" />}

        {groupsQuery.is === "fail" && (
          <ErrorComponent className="py-4">
            <ErrorComponent.Icon>
              <BiError size={80} />
            </ErrorComponent.Icon>
            <ErrorComponent.Title>Something went wrong!</ErrorComponent.Title>
            <ErrorComponent.Description className="mb-0">
              {groupsQuery.error.message}
            </ErrorComponent.Description>
          </ErrorComponent>
        )}

        {groupsQuery.is === "ok" && (
          <>
            <p className="mb-4">
              Select groups to give access to all its members for selected
              resource.
            </p>
            <Search>
              <Search.Input
                placeholder="Filter groups by name"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onClear={() => setQuery("")}
                showClear={!!query}
              />
            </Search>
            <div className="mt-3 flex items-center justify-end gap-2">
              <Button
                className="w-fit"
                title="Create access group"
                auto
                disabled={loadingGroups}
                s={1}
                i={2}
                onClick={() => navigate(meta.routes.accessGroups.management)}
              >
                Create Group <BiPlusCircle />
              </Button>
            </div>
            {filteredGroups.length === 0 && (
              <Empty className="py-4 pt-2">
                <Empty.Icon>
                  <BiGroup size={80} />
                </Empty.Icon>
                <Empty.Title>No groups found</Empty.Title>
                <Empty.Description>
                  No groups found matching your search criteria
                </Empty.Description>
                <Empty.Action
                  auto
                  s={2}
                  i={2}
                  onClick={() => navigate(meta.routes.accessGroups.management)}
                >
                  Create First Group <BiPlusCircle />
                </Empty.Action>
              </Empty>
            )}
            {filteredGroups.length > 0 && (
              <ul className="flex flex-col gap-4 mt-4">
                {filteredGroups.map((accessGroup) => (
                  <li
                    key={accessGroup.id}
                    className={c(
                      "p-4 flex flex-col rounded-lg border border-zinc-300 dark:border-zinc-800",
                      selectedGroups.has(accessGroup.id) &&
                        "bg-blue-50 dark:bg-blue-900/20",
                    )}
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
                        <i>{accessGroup.members.length} members</i>
                      </div>
                      <Button
                        title="Select group"
                        s={1}
                        i={1}
                        auto
                        onClick={() =>
                          setSelectedGroups((prev) => {
                            const newSet = new Set(prev);
                            if (newSet.has(accessGroup.id)) {
                              newSet.delete(accessGroup.id);
                            } else {
                              newSet.add(accessGroup.id);
                            }
                            return newSet;
                          })
                        }
                      >
                        {selectedGroups.has(accessGroup.id)
                          ? "Deselect Group"
                          : "Select Group"}
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </Modal2.Body>
      <Modal2.Footer>
        <div className="flex space-x-3 w-full">
          <Button
            className="flex-1"
            i={1}
            s={2}
            auto
            disabled={disabled}
            title="Back to mindmap details"
            onClick={onBack}
          >
            Back
          </Button>
          <Button
            className="flex-1"
            i={2}
            s={2}
            disabled={loadingGroups || disabled}
            auto
            title="Confirm manual visibility changes"
            onClick={() => onConfirm([...selectedGroups])}
          >
            Save
          </Button>
        </div>
      </Modal2.Footer>
    </Modal2>
  );
};

export { AccessGroupsAssignModule };
