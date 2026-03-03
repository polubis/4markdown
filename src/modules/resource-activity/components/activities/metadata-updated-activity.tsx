import React from "react";
import { ActivityTile } from "../activity-tile";
import { ActivityAuthorBadge } from "../activity-author-badge";
import { ResourceActivityModel } from "../../store/models";

type MetadataUpdatedActivityProps = {
  activity: Extract<ResourceActivityModel, { type: "metadata-updated" }>;
};

const MetadataUpdatedActivity = ({
  activity,
}: MetadataUpdatedActivityProps) => {
  const tagsChanged =
    activity.previousMeta.tags.join(",") !== activity.newMeta.tags.join(",");
  const descriptionChanged =
    activity.previousMeta.description !== activity.newMeta.description;
  const hasPreviousTags = activity.previousMeta.tags.length > 0;
  const hasNewTags = activity.newMeta.tags.length > 0;
  const hasPreviousDescription =
    activity.previousMeta.description &&
    activity.previousMeta.description.trim().length > 0;
  const hasNewDescription =
    activity.newMeta.description &&
    activity.newMeta.description.trim().length > 0;

  return (
    <ActivityTile activity={activity}>
      <div className="mb-2">
        <ActivityAuthorBadge
          authorProfile={activity.authorProfile}
          className="mb-1"
        />
        <h3 className="text-base font-semibold text-black dark:text-white">
          Metadata Updated
        </h3>
      </div>
      <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
        <p className="mb-2">Resource metadata was updated.</p>
        {tagsChanged || descriptionChanged ? (
          <>
            {tagsChanged && (
              <div className="mb-2">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Tags:
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  {hasPreviousTags ? (
                    <>
                      <span className="line-through text-gray-500 dark:text-gray-500">
                        {activity.previousMeta.tags.join(", ") || "None"}
                      </span>
                      <span
                        className="text-gray-400 dark:text-gray-500"
                        aria-hidden="true"
                      >
                        →
                      </span>
                    </>
                  ) : null}
                  <span className="font-medium text-black dark:text-white">
                    {hasNewTags ? activity.newMeta.tags.join(", ") : "None"}
                  </span>
                </div>
              </div>
            )}
            {descriptionChanged && (
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Description:
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  {hasPreviousDescription ? (
                    <>
                      <span className="line-through text-gray-500 dark:text-gray-500 truncate max-w-xs">
                        {activity.previousMeta.description}
                      </span>
                      <span
                        className="text-gray-400 dark:text-gray-500"
                        aria-hidden="true"
                      >
                        →
                      </span>
                    </>
                  ) : null}
                  <span className="font-medium text-black dark:text-white truncate max-w-xs">
                    {hasNewDescription ? activity.newMeta.description : "None"}
                  </span>
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            No visible changes detected.
          </p>
        )}
      </div>
    </ActivityTile>
  );
};

export { MetadataUpdatedActivity };
