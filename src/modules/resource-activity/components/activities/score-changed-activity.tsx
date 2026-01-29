import React from "react";
import { ActivityTile } from "../activity-tile";
import { ActivityAuthorBadge } from "../activity-author-badge";
import { ResourceActivityDto } from "api-4markdown-contracts";

type ScoreChangedActivityProps = {
  activity: Extract<ResourceActivityDto, { type: "score-changed" }>;
};

const ScoreChangedActivity = ({ activity }: ScoreChangedActivityProps) => {
  return (
    <ActivityTile activity={activity}>
      <div className="mb-2">
        <ActivityAuthorBadge
          authorProfile={activity.authorProfile}
          className="mb-1"
        />
        <h3 className="text-base font-semibold text-black dark:text-white">
          Score Changed
        </h3>
      </div>
      <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
        <p className="mb-2">Resource score was updated.</p>
        <div className="flex items-center gap-2 mb-1">
          <span className="line-through text-gray-500 dark:text-gray-500 font-mono tabular-nums">
            {activity.previousScore.scoreAverage.toFixed(1)}
          </span>
          <span className="text-gray-400 dark:text-gray-500">→</span>
          <span className="font-medium text-black dark:text-white font-mono tabular-nums">
            {activity.newScore.scoreAverage.toFixed(1)}
          </span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Based on {activity.newScore.scoreCount} rating
          {activity.newScore.scoreCount !== 1 ? "s" : ""}
        </p>
      </div>
    </ActivityTile>
  );
};

export { ScoreChangedActivity };
