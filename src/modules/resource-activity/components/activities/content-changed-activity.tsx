import React from "react";
import { ActivityTile } from "../activity-tile";
import { ActivityAuthorBadge } from "../activity-author-badge";
import { ResourceActivityDto } from "api-4markdown-contracts";
import { MarkdownDiffViewer } from "components/markdown-diff-viewer";
import { Button } from "design-system/button";
import { BiCodeAlt, BiChevronUp } from "react-icons/bi";

type ContentChangedActivityProps = {
  activity: Extract<ResourceActivityDto, { type: "content-changed" }>;
};

const ContentChangedActivity = ({ activity }: ContentChangedActivityProps) => {
  const [showDiff, setShowDiff] = React.useState(false);

  return (
    <ActivityTile activity={activity}>
      <div className="mb-2">
        <ActivityAuthorBadge authorProfile={activity.authorProfile} className="mb-1" />
        <h3 className="text-base font-semibold text-black dark:text-white">
          Content Changed
        </h3>
      </div>
      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
        The resource content was updated. Changes were made to improve clarity and structure.
      </p>
      <div className="flex justify-end">
        <Button
          title={showDiff ? "Hide content diff" : "View content diff"}
          s={1}
          i={2}
          auto
          onClick={() => setShowDiff(!showDiff)}
          className="w-full sm:w-auto"
        >
          {showDiff ? (
            <>
              Hide Diff <BiChevronUp />
            </>
          ) : (
            <>
              View Diff <BiCodeAlt />
            </>
          )}
        </Button>
      </div>
      {showDiff && (
        <div className="mt-4">
          <MarkdownDiffViewer
            previous={activity.previousContent}
            current={activity.newContent}
            previousLabel="Previous Version"
            currentLabel="New Version"
            className="mt-2"
          />
        </div>
      )}
    </ActivityTile>
  );
};

export { ContentChangedActivity };
