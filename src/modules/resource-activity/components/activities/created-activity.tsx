import React from "react";
import { ActivityTile } from "../activity-tile";
import { ActivityAuthorBadge } from "../activity-author-badge";
import { ResourceActivityModel } from "../../store/models";

type CreatedActivityProps = {
  activity: Extract<ResourceActivityModel, { type: "created" }>;
};

const CreatedActivity = ({ activity }: CreatedActivityProps) => {
  return (
    <ActivityTile activity={activity}>
      <div className="mb-2">
        <ActivityAuthorBadge
          authorProfile={activity.authorProfile}
          className="mb-1"
        />
        <h3 className="text-base font-semibold text-black dark:text-white">
          Resource Created
        </h3>
      </div>
      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
        The resource was initially created. This marks the beginning of the
        resource&apos;s lifecycle.
      </p>
    </ActivityTile>
  );
};

export { CreatedActivity };
