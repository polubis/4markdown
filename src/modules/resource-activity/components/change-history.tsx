import React from "react";
import { BiError, BiHistory } from "react-icons/bi";
import { useResourceActivityState } from "../store";
import { Empty } from "design-system/empty";
import { Err } from "design-system/err";
import { ChangeHistorySkeletonLoader } from "./change-history-skeleton-loader";
import { ActivityItem } from "./activity-item";
import { ResourceActivityModel } from "../store/models";
import { Button } from "design-system/button";

type ChangeHistoryProps = {
  onRetry?: () => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
};

type ActivityGroup = {
  monthYear: string;
  activities: ResourceActivityModel[];
};

const formatMonthYear = (cdate: ResourceActivityModel["cdate"]): string => {
  const date = new Date(cdate);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
};

const ChangeHistory = ({
  onRetry,
  onLoadMore,
  hasMore = false,
  isLoadingMore = false,
}: ChangeHistoryProps) => {
  const state = useResourceActivityState();

  const groupedActivities = React.useMemo(() => {
    if (state.is !== `ok` || state.data.length === 0) {
      return [];
    }

    const groups: ActivityGroup[] = [];
    let currentGroup: ActivityGroup | null = null;

    for (const activity of state.data) {
      const monthYearLabel = formatMonthYear(activity.cdate);

      if (!currentGroup || currentGroup.monthYear !== monthYearLabel) {
        currentGroup = {
          monthYear: monthYearLabel,
          activities: [],
        };
        groups.push(currentGroup);
      }

      currentGroup.activities.push(activity);
    }

    return groups;
  }, [state]);

  if (state.is === `idle` || state.is === `busy`) {
    return <ChangeHistorySkeletonLoader />;
  }

  if (state.is === `fail`) {
    return (
      <Err>
        <Err.Icon>
          <BiError size={80} />
        </Err.Icon>
        <Err.Title>Something went wrong!</Err.Title>
        <Err.Description>{state.error.message}</Err.Description>
        {onRetry && (
          <Err.Action
            title="Retry loading change history"
            auto
            s={2}
            i={2}
            onClick={onRetry}
          >
            Try Again
          </Err.Action>
        )}
      </Err>
    );
  }

  if (state.data.length === 0) {
    return (
      <Empty>
        <Empty.Icon>
          <BiHistory size={80} />
        </Empty.Icon>
        <Empty.Title>No Change History</Empty.Title>
        <Empty.Description>
          No change history available for this resource yet.
        </Empty.Description>
      </Empty>
    );
  }

  return (
    <div className="relative w-full min-h-full bg-white dark:bg-zinc-950 py-8 px-4 sm:px-6 md:px-8">
      <div className="max-w-3xl mx-auto relative">
        <div className="relative flex justify-center">
          <div className="absolute top-0 bottom-0 w-0.5 z-0 left-1/2 -translate-x-1/2">
            <div className="h-full border-l-2 border-dashed border-gray-300 dark:border-zinc-700" />
          </div>

          <ul className="relative space-y-6 w-full">
            {groupedActivities.map((group, groupIndex) => {
              const previousActivitiesCount = groupedActivities
                .slice(0, groupIndex)
                .reduce((sum, g) => sum + g.activities.length, 0);

              return (
                <React.Fragment key={group.monthYear}>
                  <li className="relative flex flex-col items-center w-full">
                    <div className="relative z-10 inline-flex px-2 py-1 rounded-full bg-gray-100 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700">
                      <time
                        className="text-xs font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap"
                        dateTime={group.activities[0]?.cdate}
                      >
                        {group.monthYear}
                      </time>
                    </div>
                  </li>
                  {group.activities.map((activity, activityIndexInGroup) => {
                    const index =
                      previousActivitiesCount + activityIndexInGroup;
                    return (
                      <ActivityItem
                        key={activity.id}
                        activity={activity}
                        index={index}
                      />
                    );
                  })}
                </React.Fragment>
              );
            })}
          </ul>
        </div>
        {hasMore && onLoadMore && (
          <div className="mt-6 flex justify-center">
            <Button
              auto
              s={1}
              i={2}
              disabled={isLoadingMore}
              title="Load more activity"
              onClick={onLoadMore}
            >
              {isLoadingMore ? "Loading..." : "Load More"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export { ChangeHistory };
