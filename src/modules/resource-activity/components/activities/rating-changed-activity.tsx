import React from "react";
import { RATING_ICONS } from "core/rating-config";
import { ActivityTile } from "../activity-tile";
import { ActivityAuthorBadge } from "../activity-author-badge";
import { ResourceActivityDto } from "api-4markdown-contracts";

type RatingChangedActivityProps = {
  activity: Extract<ResourceActivityDto, { type: "rating-changed" }>;
};

const RatingChangedActivity = ({ activity }: RatingChangedActivityProps) => {
  return (
    <ActivityTile activity={activity}>
      <div className="mb-2">
        <ActivityAuthorBadge authorProfile={activity.authorProfile} className="mb-1" />
        <h3 className="text-base font-semibold text-black dark:text-white">
          Rating Changed
        </h3>
      </div>
      <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
        <p className="mb-2">Resource rating was updated.</p>
        <div className="flex items-center gap-3 flex-wrap">
          {RATING_ICONS.map(([Icon, category]) => {
            const previousCount = activity.previousRating?.[category] ?? 0;
            const newCount = activity.newRating?.[category] ?? 0;
            const hasChanged = previousCount !== newCount;
            const shouldShow = previousCount > 0 || newCount > 0;

            if (!shouldShow) return null;

            return (
              <div
                key={category}
                className="flex items-center gap-1.5 text-xs"
              >
                <Icon className="text-gray-600 dark:text-gray-400" size={16} aria-hidden="true" />
                {hasChanged && previousCount > 0 && (
                  <>
                    <span className="line-through text-gray-500 dark:text-gray-500 font-mono tabular-nums">
                      {previousCount}
                    </span>
                    <span className="text-gray-400 dark:text-gray-500" aria-hidden="true">→</span>
                  </>
                )}
                <span className="font-medium text-black dark:text-white font-mono tabular-nums">
                  {newCount}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </ActivityTile>
  );
};

export { RatingChangedActivity };
