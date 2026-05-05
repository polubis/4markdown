import React from "react";
import { Drawer } from "design-system/drawer";
import { c } from "design-system/c";
import type { MindmapPreviewOkMindmap } from "store/mindmap-preview/models";
import { aggregateMindmapPreviewDetails } from "../utils/mindmap-preview-details-stats";
import { RATING_ICONS } from "core/rating-config";
import { BullshitMeter } from "components/bullshit-meter";
import type { Atoms } from "api-4markdown-contracts";
import { VisibilityIcon } from "components/visibility-icon";

type MindmapPreviewDetailsDrawerProps = {
  mindmap: MindmapPreviewOkMindmap;
  onClose(): void;
};

const formatUtcDateTime = (iso: Atoms["UTCDate"]): string =>
  new Intl.DateTimeFormat(undefined, {
    dateStyle: `medium`,
    timeStyle: `short`,
  }).format(new Date(iso));

const formatNumber = (n: number): string =>
  new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 }).format(n);

const DetailSection = ({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <section className={c(`min-w-0`, className)}>
    <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400 mb-2 text-pretty">
      {title}
    </h3>
    {children}
  </section>
);

const StatTile = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div
    className={c(
      `rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/50`,
      `px-3 py-2 min-w-0`,
    )}
  >
    <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{label}</p>
    <p className="text-lg font-semibold tabular-nums text-black dark:text-white truncate">
      {value}
    </p>
  </div>
);

const MindmapPreviewDetailsDrawer = ({
  mindmap,
  onClose,
}: MindmapPreviewDetailsDrawerProps) => {
  const stats = React.useMemo(
    () => aggregateMindmapPreviewDetails(mindmap),
    [mindmap],
  );

  const tags = mindmap.tags?.filter(Boolean) ?? [];
  const syntheticScore: Atoms["Score"] = {
    scoreAverage:
      stats.scoreSubmissionCount > 0 ? stats.mapLevelBullshitAverage : 0,
    scoreCount: Math.max(0, Math.round(stats.scoreSubmissionCount)),
    scoreValues: [],
  };

  return (
    <Drawer onClose={onClose}>
      <Drawer.Header title={mindmap.name} />
      <Drawer.Body
        id="mindmap-preview-details-drawer"
        className="space-y-6 pb-8"
      >
        <section className="space-y-4 min-w-0">
          <div className="flex flex-wrap gap-4">
            <div className="min-w-0 flex-1 basis-[12rem]">
              <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400 mb-2 text-pretty">
                Visibility
              </p>
              <p className="inline-flex items-center gap-1.5 capitalize text-sm text-zinc-700 dark:text-zinc-300 min-w-0">
                <VisibilityIcon
                  visibility={mindmap.visibility}
                  className="size-5 shrink-0"
                />
                <span className="truncate">{mindmap.visibility}</span>
              </p>
            </div>
            {mindmap.orientation ? (
              <div className="min-w-0 flex-1 basis-[10rem]">
                <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400 mb-2 text-pretty">
                  Layout
                </p>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 uppercase">
                  {mindmap.orientation}
                </p>
              </div>
            ) : null}
            <div className="min-w-0 flex-[2_1_18rem]">
              <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400 mb-2 text-pretty">
                Path
              </p>
              <p className="text-xs font-mono text-zinc-600 dark:text-zinc-400 break-all">
                {mindmap.path}
              </p>
            </div>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400 mb-2 text-pretty">
              Author
            </p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 truncate">
              {mindmap.authorProfile?.displayName
                ? `By ${mindmap.authorProfile.displayName}`
                : `Unknown`}
            </p>
          </div>
        </section>

        <DetailSection title="Description">
          {mindmap.description?.trim() ? (
            <p className="text-sm text-zinc-700 dark:text-zinc-300 break-words whitespace-pre-wrap">
              {mindmap.description}
            </p>
          ) : (
            <p className="text-sm text-zinc-500 dark:text-zinc-500 italic">
              No description
            </p>
          )}
        </DetailSection>

        <DetailSection title="Tags">
          {tags.length > 0 ? (
            <ul className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <li key={tag}>
                  <span
                    className={c(
                      `inline-flex max-w-full items-center rounded-md px-2 py-0.5 text-xs font-medium`,
                      `bg-zinc-200/90 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200`,
                      `truncate`,
                    )}
                  >
                    {tag}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-zinc-500 dark:text-zinc-500 italic">
              No tags
            </p>
          )}
        </DetailSection>

        <DetailSection title="Structure">
          <div className="grid grid-cols-2 gap-2">
            <StatTile label="Nodes" value={stats.nodeCount} />
            <StatTile label="Connections" value={stats.edgeCount} />
            <StatTile label="Comments (nodes)" value={stats.totalComments} />
            <StatTile label="Rating votes" value={stats.totalRatingVotes} />
            <StatTile label="Score votes" value={stats.scoreSubmissionCount} />
            <StatTile
              label="Score value"
              value={
                stats.scoreSubmissionCount > 0
                  ? `${formatNumber(stats.mapLevelScoreAverage)}/10`
                  : "—"
              }
            />
          </div>
        </DetailSection>

        <DetailSection title="Dates">
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-3 min-w-0">
              <dt className="text-zinc-500 dark:text-zinc-400 shrink-0">
                Created
              </dt>
              <dd className="text-right tabular-nums min-w-0 break-words">
                <time dateTime={mindmap.cdate}>
                  {formatUtcDateTime(mindmap.cdate)}
                </time>
              </dd>
            </div>
            <div className="flex justify-between gap-3 min-w-0">
              <dt className="text-zinc-500 dark:text-zinc-400 shrink-0">
                Last Modified
              </dt>
              <dd className="text-right tabular-nums min-w-0 break-words">
                <time dateTime={mindmap.mdate}>
                  {formatUtcDateTime(mindmap.mdate)}
                </time>
              </dd>
            </div>
          </dl>
        </DetailSection>

        <DetailSection title="Ratings (aggregated)">
          {stats.totalRatingVotes > 0 ? (
            <ul
              className="space-y-1.5"
              aria-label="Rating breakdown by category"
            >
              {RATING_ICONS.map(([Icon, category]) => {
                const count = stats.aggregatedRating[category];
                return (
                  <li
                    key={category}
                    className="flex items-center justify-between gap-2 text-sm min-w-0"
                  >
                    <span className="flex items-center gap-2 min-w-0 text-zinc-700 dark:text-zinc-300">
                      <Icon className="shrink-0 text-lg" aria-hidden="true" />
                      <span className="capitalize truncate">{category}</span>
                    </span>
                    <span className="tabular-nums font-medium shrink-0">
                      {count}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-zinc-500 dark:text-zinc-500">
              No ratings yet across nodes
            </p>
          )}
        </DetailSection>

        <DetailSection title="Scores & Bullshit Meter">
          {stats.nodesWithScores > 0 ? (
            <>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">
                Averages are weighted by how many scores each node received (
                {formatNumber(stats.mapLevelScoreAverage)} quality avg,{" "}
                {formatNumber(stats.mapLevelBullshitAverage)} bullshit avg).
              </p>
              <BullshitMeter
                rating={stats.aggregatedRating}
                score={syntheticScore}
                commentsCount={stats.totalComments}
              />
            </>
          ) : (
            <p className="text-sm text-zinc-500 dark:text-zinc-500">
              No bullshit meter scores yet. Open a node to add or view scores.
            </p>
          )}
        </DetailSection>
      </Drawer.Body>
    </Drawer>
  );
};

export { MindmapPreviewDetailsDrawer };
