import React from "react";
import { Link } from "gatsby";
import { BiChevronDown, BiChevronUp, BiMove, BiX } from "react-icons/bi";
import c from "classnames";
import { Button } from "design-system/button";
import { meta } from "../../../../meta";
import type { PreviousWorkEntry } from "../store/models";
import { useDocStore } from "store/doc/doc.store";
import { useMindmapCreatorState } from "store/mindmap-creator";

const MAX_PER_CATEGORY = 10;

function getEntryUrl(entry: PreviousWorkEntry): string {
  if (entry.type === `document`) {
    return `${meta.routes.home}?id=${entry.resourceId}`;
  }
  return `${meta.routes.mindmaps.creator}?mindmapId=${entry.resourceId}`;
}

const categoryHeadingClassName =
  "text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3";

const linkTileClassName =
  "block w-full min-w-0 text-left truncate rounded-md font-medium px-2 py-1.5 text-sm bg-zinc-200/80 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-300/80 dark:hover:bg-zinc-700/80 outline-none focus:outline focus:outline-2.5 focus:outline-offset-0 focus:outline-black dark:focus:outline-2 dark:focus:outline-white touch-action-manipulation";

const CategorySection = ({
  id,
  title,
  entries,
  onLinkClick,
  isEntryActive,
}: {
  id: string;
  title: string;
  entries: PreviousWorkEntry[];
  onLinkClick?: () => void;
  isEntryActive: (entry: PreviousWorkEntry) => boolean;
}) => {
  const shown = entries.slice(0, MAX_PER_CATEGORY);
  const remaining = entries.length - MAX_PER_CATEGORY;
  if (shown.length === 0) return null;
  return (
    <section aria-labelledby={id}>
      <h3 id={id} className={categoryHeadingClassName}>
        {title}
      </h3>
      <ul className="flex flex-col gap-2 list-none p-0 m-0">
        {shown.map((entry, index) => {
          const active = isEntryActive(entry);
          return (
            <li
              key={getEntryUrl(entry)}
              className="min-w-0 previous-work-item-in"
              style={{ animationDelay: `${index * 40}ms` }}
            >
              <Link
                to={getEntryUrl(entry)}
                onClick={onLinkClick}
                className={c(
                  linkTileClassName,
                  active &&
                    "!bg-green-700 !text-white hover:!bg-green-700 dark:!bg-green-700 dark:hover:!bg-green-700",
                )}
                title={entry.title || "Untitled"}
                aria-current={active ? "true" : undefined}
              >
                {entry.title || "Untitled"}
              </Link>
            </li>
          );
        })}
      </ul>
      {remaining > 0 && (
        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-2">
          +{remaining} more
        </p>
      )}
    </section>
  );
};

type PinnedEdges = {
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
};

const PreviousWorkWidget = ({
  entries,
  onLinkClick,
  onClose,
  minimized = false,
  onToggleMinimize,
  onMovePointerDown,
  pinnedEdges,
}: {
  entries: PreviousWorkEntry[];
  onLinkClick?: () => void;
  onClose?: () => void;
  minimized?: boolean;
  onToggleMinimize?: () => void;
  onMovePointerDown?: (e: React.PointerEvent) => void;
  pinnedEdges?: PinnedEdges;
}) => {
  const docStore = useDocStore();
  const activeMindmapId = useMindmapCreatorState((s) => s.activeMindmapId);

  const activeDocumentId = docStore.is === `active` ? docStore.id : null;

  const isEntryActive = React.useCallback(
    (entry: PreviousWorkEntry): boolean => {
      if (entry.type === `document`)
        return entry.resourceId === activeDocumentId;
      return entry.resourceId === activeMindmapId;
    },
    [activeDocumentId, activeMindmapId],
  );

  if (entries.length === 0) return null;

  const documents = entries.filter(
    (e): e is Extract<PreviousWorkEntry, { type: "document" }> =>
      e.type === `document`,
  );
  const mindmaps = entries.filter(
    (e): e is Extract<PreviousWorkEntry, { type: "mindmap" }> =>
      e.type === `mindmap`,
  );

  const edgeRounded =
    pinnedEdges &&
    !pinnedEdges.top &&
    !pinnedEdges.right &&
    !pinnedEdges.bottom &&
    !pinnedEdges.left;
  const radiusClasses = edgeRounded
    ? "rounded-lg"
    : c(
        "rounded-lg",
        pinnedEdges?.top && "rounded-tl-none rounded-tr-none",
        pinnedEdges?.bottom && "rounded-bl-none rounded-br-none",
        pinnedEdges?.left && "rounded-tl-none rounded-bl-none",
        pinnedEdges?.right && "rounded-tr-none rounded-br-none",
      );

  return (
    <section
      className={c(
        "border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 shadow-sm flex flex-col",
        radiusClasses,
        minimized ? "w-auto max-h-none" : "w-[20rem] max-h-[min(80vh,28rem)]",
      )}
      data-testid="[previous-work]:widget"
      aria-label="Previous work"
    >
      <div
        className={c(
          "flex items-center gap-2 p-4 shrink-0",
          minimized ? "justify-end" : "justify-between",
        )}
      >
        {!minimized && (
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 m-0 truncate min-w-0">
            Previous work
          </h2>
        )}
        <div className="flex items-center gap-1 shrink-0">
          {onToggleMinimize && (
            <Button
              i={2}
              s={1}
              title={
                minimized ? "Expand previous work" : "Minimize previous work"
              }
              aria-label={minimized ? "Expand" : "Minimize"}
              onClick={onToggleMinimize}
            >
              {minimized ? (
                <BiChevronUp aria-hidden />
              ) : (
                <BiChevronDown aria-hidden />
              )}
            </Button>
          )}
          {onMovePointerDown && (
            <Button
              i={2}
              s={1}
              title="Drag to move widget"
              aria-label="Drag to move widget"
              onPointerDown={onMovePointerDown}
            >
              <BiMove aria-hidden />
            </Button>
          )}
          {onClose && (
            <Button
              i={2}
              s={1}
              title="Close previous work"
              aria-label="Close previous work"
              onClick={onClose}
            >
              <BiX aria-hidden />
            </Button>
          )}
        </div>
      </div>
      {!minimized && (
        <nav
          className="flex flex-col gap-8 p-4 overflow-y-auto overscroll-contain min-h-0"
          aria-label="Previous work by category"
        >
          <CategorySection
            id="previous-work-documents-heading"
            title="Documents"
            entries={documents}
            onLinkClick={onLinkClick}
            isEntryActive={isEntryActive}
          />
          <CategorySection
            id="previous-work-mindmaps-heading"
            title="Mindmaps"
            entries={mindmaps}
            onLinkClick={onLinkClick}
            isEntryActive={isEntryActive}
          />
        </nav>
      )}
    </section>
  );
};

export { PreviousWorkWidget };
