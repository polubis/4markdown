import React, { useEffect, useMemo } from "react";
import { navigate } from "gatsby";
import { differenceInDays, formatDistance } from "date-fns";
import { BiCollection, BiError, BiPencil, BiRefresh } from "react-icons/bi";
import { Button } from "design-system/button";
import { Empty } from "design-system/empty";
import { Err } from "design-system/err";
import { meta } from "../../../../meta";
import { useMindmapCreatorState } from "store/mindmap-creator";
import { getYourMindmapsAct } from "acts/get-your-mindmaps.act";
import { reloadYourMindmapsAct } from "acts/reload-your-mindmaps.act";
import { YourMindmapsSkeletonLoader } from "../components/your-mindmaps-skeleton-loader";
import { VisibilityIcon } from "components/visibility-icon";
import type { MindmapDto } from "api-4markdown-contracts";
import type { Atoms } from "api-4markdown-contracts";
import { createPathForMindmap } from "core/create-path-for-mindmap";

const getMindmapPreviewUrl = (mindmap: MindmapDto): string =>
  `${meta.routes.mindmaps.preview}?mindmapId=${mindmap.id}`;

const hasPreviewUrl = (visibility: Atoms["ResourceVisibility"]): boolean =>
  visibility === "permanent" ||
  visibility === "public" ||
  visibility === "manual";

const getStaticUrl = (mindmap: MindmapDto): string | undefined =>
  mindmap.visibility === "permanent"
    ? createPathForMindmap(mindmap.id, mindmap.path)
    : undefined;

const getDescription = (mindmap: MindmapDto): string | undefined => {
  if (mindmap.description == null) return undefined;
  const trimmed =
    typeof mindmap.description === "string" ? mindmap.description.trim() : "";
  return trimmed || undefined;
};

const getTags = (mindmap: MindmapDto): string[] | undefined => {
  if (!Array.isArray(mindmap.tags)) return undefined;
  const filtered = mindmap.tags.filter(
    (t): t is string => typeof t === "string" && t.trim() !== "",
  );
  return filtered.length > 0 ? filtered : undefined;
};

const TAG_PILL_STYLE =
  "bg-zinc-200 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200";

const getEditedLabel = (mdate: string): string => {
  const date = new Date(mdate);
  const now = new Date();
  const days = differenceInDays(now, date);
  if (days === 0) return "today";
  return formatDistance(now, date, { addSuffix: true });
};

const Content = () => {
  const mindmapsState = useMindmapCreatorState((s) => s.mindmaps);

  const entries = useMemo(() => {
    if (mindmapsState.is !== "ok") return [];
    return [...mindmapsState.data].sort(
      (a, b) => new Date(b.mdate).getTime() - new Date(a.mdate).getTime(),
    );
  }, [mindmapsState]);

  if (
    mindmapsState.is === "idle" ||
    (mindmapsState.is === "busy" && entries.length === 0)
  ) {
    return <YourMindmapsSkeletonLoader data-testid="[your-mindmaps]:loader" />;
  }

  if (mindmapsState.is === "fail") {
    return (
      <Err>
        <Err.Icon>
          <BiError size={80} />
        </Err.Icon>
        <Err.Title>Something went wrong!</Err.Title>
        <Err.Description>{mindmapsState.error.message}</Err.Description>
        <Err.Action
          title="Retry loading mindmaps"
          auto
          s={2}
          i={2}
          onClick={() => getYourMindmapsAct()}
        >
          Try Again
        </Err.Action>
      </Err>
    );
  }

  if (entries.length === 0) {
    return (
      <Empty id="empty-state-your-mindmaps">
        <Empty.Icon>
          <BiCollection size={80} />
        </Empty.Icon>
        <Empty.Title id="empty-title-your-mindmaps">
          No mindmaps here
        </Empty.Title>
        <Empty.Description aria-describedby="empty-title-your-mindmaps">
          Create mindmaps in the creator to see them here
        </Empty.Description>
      </Empty>
    );
  }

  return (
    <ul className="columns-1 md:columns-2 lg:columns-3 gap-4 [column-fill:_balance] animate-fade-in">
      {entries.map((mindmap) => {
        const previewUrl = getMindmapPreviewUrl(mindmap);
        const staticUrl = getStaticUrl(mindmap);
        const showPreview = hasPreviewUrl(mindmap.visibility);
        const description = getDescription(mindmap);
        const tags = getTags(mindmap);
        const editedLabel = getEditedLabel(mindmap.mdate);
        const creatorUrl = `${meta.routes.mindmaps.creator}?mindmapId=${mindmap.id}`;
        return (
          <li
            key={mindmap.id}
            className="break-inside-avoid mb-4 p-4 flex flex-col rounded-lg border border-zinc-300 dark:border-zinc-800"
          >
            <div className="flex flex-col min-w-0">
              <div
                className="w-full rounded-lg mb-3 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 min-h-[120px]"
                style={{ maxHeight: "120px" }}
              >
                <span
                  className="text-2xl font-semibold text-zinc-500 dark:text-zinc-400 uppercase"
                  aria-hidden="true"
                >
                  mindmap
                </span>
              </div>
              <div className="flex justify-between items-start gap-2 mb-1">
                <h3 className="text-sm font-medium text-pretty line-clamp-2 min-w-0 flex-1">
                  {mindmap.name}
                </h3>
                <VisibilityIcon
                  visibility={mindmap.visibility}
                  className="size-5 shrink-0"
                />
              </div>
              {description !== undefined ? (
                <p
                  className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-4 min-w-0 mt-1 break-words"
                  title={description}
                >
                  {description}
                </p>
              ) : null}
              {tags !== undefined && tags.length > 0 ? (
                <ul
                  className="mt-1 flex flex-wrap gap-1.5 min-w-0 list-none"
                  aria-label="Tags"
                >
                  {tags.map((tag, i) => (
                    <li key={`${tag}-${i}`}>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium break-words ${TAG_PILL_STYLE}`}
                      >
                        {tag}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Edited <span suppressHydrationWarning>{editedLabel}</span>
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2 mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-700">
              <Button
                auto
                title="Open in mindmap creator"
                aria-label="Edit mindmap in creator"
                s={1}
                i={2}
                onClick={() => navigate(creatorUrl)}
              >
                <BiPencil aria-hidden />
                Edit
              </Button>
              {showPreview && (
                <Button
                  auto
                  title="Open preview (live URL)"
                  aria-label="Open mindmap preview"
                  s={1}
                  i={2}
                  onClick={() => navigate(previewUrl)}
                >
                  Preview
                </Button>
              )}
              {staticUrl && (
                <Button
                  auto
                  title="Open static URL"
                  aria-label="Open permanent mindmap URL"
                  s={1}
                  i={2}
                  onClick={() => navigate(staticUrl)}
                >
                  Static URL
                </Button>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

const YourMindmapsGridContainer = () => {
  const mindmapsState = useMindmapCreatorState((s) => s.mindmaps);

  useEffect(() => {
    getYourMindmapsAct();
  }, []);

  const entries = useMemo(() => {
    if (mindmapsState.is !== "ok") return [];
    return mindmapsState.data;
  }, [mindmapsState]);

  return (
    <div className="max-w-6xl w-full mx-auto animate-fade-in">
      <header className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-pretty">Your mindmaps</h1>
          <Button
            i={2}
            s={1}
            title="Sync mindmaps"
            onClick={() => reloadYourMindmapsAct()}
            disabled={mindmapsState.is === `busy`}
            aria-label="Refresh mindmaps"
          >
            <BiRefresh />
          </Button>
        </div>
        {mindmapsState.is === "ok" && entries.length > 0 && (
          <h2 className="text-lg font-semibold font-variant-numeric tabular-nums text-pretty">
            Results: {entries.length}
          </h2>
        )}
      </header>
      <section className="mt-6" aria-label="Your mindmaps grid">
        <Content />
      </section>
    </div>
  );
};

export { YourMindmapsGridContainer };
