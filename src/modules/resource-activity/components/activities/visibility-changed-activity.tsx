import React from "react";
import { VisibilityIcon } from "components/visibility-icon";
import { ActivityTile } from "../activity-tile";
import { ActivityAuthorBadge } from "../activity-author-badge";
import { ResourceActivityDto } from "api-4markdown-contracts";

type VisibilityChangedActivityProps = {
  activity: Extract<ResourceActivityDto, { type: "visibility-changed" }>;
};

const VisibilityChangedActivity = ({
  activity,
}: VisibilityChangedActivityProps) => {
  return (
    <ActivityTile activity={activity}>
      <div className="mb-2">
        <ActivityAuthorBadge authorProfile={activity.authorProfile} className="mb-1" />
        <h3 className="text-base font-semibold text-black dark:text-white">
          Visibility Changed
        </h3>
      </div>
      <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
        <p className="mb-2">Resource visibility was changed.</p>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 line-through text-gray-500 dark:text-gray-500">
            <VisibilityIcon visibility={activity.previousVisibility} size={16} aria-hidden="true" />
            <span className="capitalize">{activity.previousVisibility}</span>
          </div>
          <span className="text-gray-400 dark:text-gray-500" aria-hidden="true">→</span>
          <div className="flex items-center gap-1 font-medium text-black dark:text-white">
            <VisibilityIcon visibility={activity.newVisibility} size={16} aria-hidden="true" />
            <span className="capitalize">{activity.newVisibility}</span>
          </div>
        </div>
      </div>
    </ActivityTile>
  );
};

export { VisibilityChangedActivity };
