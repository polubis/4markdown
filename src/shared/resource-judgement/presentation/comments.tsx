import React, { type ComponentProps } from "react";
import { c } from "design-system/c";
import { Avatar } from "design-system/avatar";
import { Button } from "design-system/button";
import { Field } from "design-system/field";
import { Modal2 } from "design-system/modal2";
import { Textarea } from "design-system/textarea";
import { Skeleton } from "design-system/skeleton";
import { Err } from "design-system/err";
import { Empty } from "design-system/empty";
import { useInViewport } from "development-kit/use-in-viewport";
import { useYourUserProfileState } from "store/your-user-profile";
import type { Comment, Rating, RatingCategory } from "../domain/models";
import type { IconType } from "react-icons";
import {
  RATING_BG_COLORS,
  RATING_BURST_COUNT,
  RATING_COLORS,
  RATING_ICONS,
} from "./config";
import { RatePopover } from "./rate-popover";
import { useContext } from "./context";
import {
  BiChevronDown,
  BiCommentAdd,
  BiError,
  BiMessageSquareDetail,
  BiPencil,
  BiTrash,
} from "react-icons/bi";

/** Fixed preview height — keeps layout stable while loading and before expand. */
const COMMENTS_PREVIEW_HEIGHT_PX = 280;

const CommentsFadeIn = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={c("motion-safe:animate-fade-in", className)}>{children}</div>
);

const cardClass = c(
  "rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm",
  "dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-lg dark:shadow-black/50",
);

const commentRowClass = "flex gap-3";

const ownerActionsPaddingClass = "pr-10 tn:pr-20";

const commentsActionButtonClass = c(
  "inline-flex items-center gap-1.5 rounded-full",
  "border border-zinc-400/90 bg-white/95 px-4 py-2 text-base font-semibold leading-none",
  "text-zinc-900 shadow-sm backdrop-blur-md",
  "transition-colors hover:border-zinc-500 hover:bg-white",
  "dark:border-zinc-400/80 dark:bg-zinc-950/90 dark:text-zinc-50",
  "dark:hover:border-zinc-300 dark:hover:bg-zinc-950",
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
  "focus-visible:outline-zinc-800 dark:focus-visible:outline-zinc-200",
  "disabled:cursor-not-allowed disabled:opacity-50",
);

const inputClass = c(
  "block w-full min-h-[2.5rem] resize-none bg-transparent py-2 text-sm leading-6",
  "border-0 border-b border-zinc-300 text-zinc-900 outline-none",
  "placeholder:text-zinc-500 focus:border-zinc-900",
  "dark:border-zinc-600 dark:text-zinc-100 dark:placeholder:text-zinc-400",
  "dark:focus:border-zinc-200",
  "disabled:cursor-not-allowed disabled:opacity-50",
);

const Placeholder = ({
  count,
  className,
  items: itemsOverride,
}: {
  count: number;
  className?: string;
  items?: number;
}) => {
  const items = itemsOverride ?? Math.min(Math.max(count, 1), 3);

  const skeletonBar = c(
    "from-zinc-300 via-zinc-200 to-zinc-300",
    "dark:from-zinc-700 dark:via-zinc-600 dark:to-zinc-700",
  );

  return (
    <div className={c("space-y-5", className)} aria-hidden="true">
      {Array.from({ length: items }).map((_, index) => (
        <div key={index}>
          <div className="mb-3 flex items-start gap-3">
            <Skeleton
              className={c("h-9 w-9 shrink-0 rounded-full", skeletonBar)}
            />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className={c("h-3 w-28", skeletonBar)} />
              <Skeleton className={c("h-2.5 w-16", skeletonBar)} />
            </div>
          </div>
          <div className="mb-3 space-y-2">
            <Skeleton className={c("h-3 w-full", skeletonBar)} />
            <Skeleton className={c("h-3 w-[85%]", skeletonBar)} />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className={c("h-3 w-12", skeletonBar)} />
            <Skeleton className={c("h-3 w-24", skeletonBar)} />
            <Skeleton
              className={c("ml-auto h-7 w-40 rounded-full", skeletonBar)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

const CommentsPreviewShell = ({
  expanded,
  onExpand,
  showExpandAffordance,
  expandLabel,
  children,
}: {
  expanded: boolean;
  onExpand: () => void;
  showExpandAffordance: boolean;
  expandLabel: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={c("relative", !expanded && "overflow-hidden")}
      style={expanded ? undefined : { height: COMMENTS_PREVIEW_HEIGHT_PX }}
    >
      <div className={c(!expanded && "h-full overflow-hidden")}>{children}</div>

      {showExpandAffordance && !expanded && (
        <div
          className={c(
            "absolute inset-x-0 bottom-0 z-10 flex flex-col items-center justify-end",
            "pointer-events-none pb-1.5 pt-16",
            "bg-gradient-to-t from-white from-25% via-white/85 to-transparent",
            "dark:from-zinc-900 dark:via-zinc-900/85 dark:to-transparent",
          )}
        >
          <button
            type="button"
            className={c("pointer-events-auto", commentsActionButtonClass)}
            title={expandLabel}
            onClick={onExpand}
          >
            <BiChevronDown aria-hidden="true" size={20} className="shrink-0" />
            {expandLabel}
          </button>
        </div>
      )}
    </div>
  );
};

const CommentInput = ({ disabled }: { disabled?: boolean }) => {
  const ctx = useContext();
  const yourUserProfile = useYourUserProfileState();
  const user = yourUserProfile.is === "ok" ? yourUserProfile.user : null;
  const [content, setContent] = React.useState("");
  const [focused, setFocused] = React.useState(false);
  const showActions = focused || content.trim().length > 0;
  const canSubmit = content.trim().length > 0 && !disabled;

  const submit = () => {
    if (!canSubmit) {
      return;
    }

    const trimmed = content.trim();

    ctx.addComment(trimmed, {
      authorProfileId: user?.id ?? "",
      authorDisplayName: user?.displayName ?? "Anonymous",
      authorAvatarUrl: user?.avatar?.sm?.src ?? null,
    });
    setContent("");
    setFocused(false);
  };

  const cancel = () => {
    setContent("");
    setFocused(false);
  };

  return (
    <div className={c(commentRowClass, "mb-5")}>
      <Avatar
        size="sm"
        src={user?.avatar?.sm?.src ?? undefined}
        alt={user?.displayName ?? "You"}
        title={user?.displayName ?? "You"}
        char={(user?.displayName ?? "Y").charAt(0)}
        className="shrink-0 bg-zinc-200 dark:bg-zinc-600"
      />
      <div className="min-w-0 flex-1">
        <textarea
          className={inputClass}
          value={content}
          disabled={disabled}
          rows={showActions ? 3 : 1}
          placeholder="Add a comment..."
          onChange={(event) => setContent(event.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={(event) => event.stopPropagation()}
        />
        {showActions && (
          <div className="mt-2 flex justify-end gap-2">
            <Button auto s={1} i={1} title="Cancel comment" onClick={cancel}>
              Cancel
            </Button>
            <Button
              auto
              s={1}
              i={2}
              title="Post comment"
              disabled={!canSubmit}
              onClick={submit}
            >
              Comment
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const CommentEditModal = ({
  comment,
  onClose,
}: {
  comment: Comment;
  onClose: () => void;
}) => {
  const ctx = useContext();
  const [content, setContent] = React.useState(comment.content);
  const canSave = content.trim().length > 0;

  const handleSave = (): void => {
    ctx.editComment(comment.id, content.trim());
    onClose();
  };

  return (
    <Modal2 onClose={onClose}>
      <Modal2.Header
        title="Edit comment"
        closeButtonTitle="Close comment editing"
      />
      <Modal2.Body>
        <Field label="Comment*">
          <Textarea
            value={content}
            rows={4}
            placeholder="Write your comment..."
            onKeyDown={(event) => event.stopPropagation()}
            onChange={(event) => setContent(event.target.value)}
          />
        </Field>
      </Modal2.Body>
      <Modal2.Footer className="flex gap-3">
        <Button
          auto
          className="flex-1"
          i={1}
          s={2}
          onClick={onClose}
          title="Cancel comment edit"
        >
          Cancel
        </Button>
        <Button
          auto
          className="flex-1"
          i={2}
          s={2}
          title="Save comment"
          disabled={!canSave}
          onClick={handleSave}
        >
          Save
        </Button>
      </Modal2.Footer>
    </Modal2>
  );
};

const CommentDeleteModal = ({
  commentId,
  onClose,
}: {
  commentId: Comment["id"];
  onClose: () => void;
}) => {
  const ctx = useContext();

  const handleConfirm = (): void => {
    ctx.deleteComment(commentId);
    onClose();
  };

  return (
    <Modal2 onClose={onClose}>
      <Modal2.Header title="Delete comment" closeButtonTitle="Cancel" />
      <Modal2.Body>
        <p>Are you sure you want to delete this comment?</p>
      </Modal2.Body>
      <Modal2.Footer className="flex gap-3">
        <Button
          auto
          className="flex-1"
          i={1}
          s={2}
          onClick={onClose}
          title="Cancel delete comment"
        >
          Cancel
        </Button>
        <Button
          auto
          className="flex-1"
          i={2}
          s={2}
          title="Confirm delete comment"
          onClick={handleConfirm}
        >
          Confirm
        </Button>
      </Modal2.Footer>
    </Modal2>
  );
};

const CommentsHeader = () => {
  const state = useContext().useComments();

  return (
    <header className="mb-4 flex items-center gap-2">
      <BiMessageSquareDetail
        aria-hidden="true"
        className="text-zinc-700 dark:text-zinc-200"
        size={20}
      />
      <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        Comments
      </h2>
      <span className="rounded-md bg-zinc-100 px-1.5 py-0.5 text-xs font-semibold text-zinc-600 dark:bg-zinc-700 dark:text-zinc-100">
        {state.totalCount}
      </span>
    </header>
  );
};

const sumRatingCount = (rating: Rating) =>
  rating.ugly + rating.bad + rating.decent + rating.good + rating.perfect;

const getHighlightCategory = (
  rating: Rating,
  selected: RatingCategory | null,
): RatingCategory => {
  if (selected) {
    return selected;
  }

  let highlight: RatingCategory = "decent";
  let maxCount = -1;

  for (const { category } of RATING_ICONS) {
    const count = rating[category];
    if (count > maxCount) {
      maxCount = count;
      highlight = category;
    }
  }

  return highlight;
};

const ratingCountClass =
  "text-sm font-semibold leading-none tabular-nums text-zinc-700 dark:text-zinc-200";

const ratingTotalClass =
  "text-sm font-semibold leading-none tabular-nums text-zinc-500 dark:text-zinc-400";

const CommentRatingIcon = ({
  commentId,
  category,
  Icon,
  count,
  selected,
  burst,
}: {
  commentId: Comment["id"];
  category: RatingCategory;
  Icon: IconType;
  count: number;
  selected: RatingCategory | null;
  burst: number;
}) => (
  <span className="inline-flex items-center justify-center gap-1 leading-none">
    <span className="relative inline-flex h-4 w-4 items-center justify-center">
      <Icon
        className={c(
          "h-4 w-4",
          selected === category
            ? c(
                RATING_COLORS[category],
                "fill-current motion-safe:animate-rate-jump",
              )
            : "text-zinc-700 dark:text-zinc-200",
        )}
      />
      {selected === category && (
        <span
          key={`${commentId}-${category}-${burst}`}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <span className="relative h-0 w-0">
            {Array.from({ length: RATING_BURST_COUNT[category] }).map(
              (_, i, arr) => {
                const span = 140;
                const angle =
                  arr.length === 1
                    ? -90
                    : -90 - span / 2 + (i * span) / (arr.length - 1);
                return (
                  <span
                    key={i}
                    className="absolute left-0 top-0"
                    style={{
                      transform: `rotate(${angle}deg)`,
                      transformOrigin: "0 0",
                    }}
                  >
                    <span
                      className={c(
                        "block h-0.5 w-2 origin-left rounded-full",
                        "motion-safe:animate-rate-burst",
                        RATING_BG_COLORS[category],
                      )}
                      style={{
                        marginLeft: "0.75rem",
                        animationDelay: `${i * 40}ms`,
                      }}
                    />
                  </span>
                );
              },
            )}
          </span>
        </span>
      )}
    </span>
    <span className={ratingCountClass}>{count}</span>
  </span>
);

const List = () => {
  const ctx = useContext();
  const state = ctx.useComments();
  const yourUserProfile = useYourUserProfileState();
  const userProfileId =
    yourUserProfile.is === "ok" ? (yourUserProfile.user?.id ?? null) : null;
  const [bursts, setBursts] = React.useState<Record<string, number>>({});
  const [editingComment, setEditingComment] = React.useState<Comment | null>(
    null,
  );
  const [deletingCommentId, setDeletingCommentId] = React.useState<
    Comment["id"] | null
  >(null);

  return (
    <>
    <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
      {state.data.map((comment) => {
        const id = String(comment.id);
        const selected = comment.myCategory ?? null;
        const burst = bursts[id] ?? 0;
        const isOwner = comment.authorProfileId === userProfileId;
        const totalRatingCount = sumRatingCount(comment.rating);
        const highlightCategory = getHighlightCategory(comment.rating, selected);
        const highlightIcon = RATING_ICONS.find(
          ({ category }) => category === highlightCategory,
        );

        return (
          <article
            key={comment.id}
            className={c(commentRowClass, "relative py-5 first:pt-0 last:pb-0")}
          >
            <Avatar
              size="sm"
              src={comment.authorAvatarUrl ?? undefined}
              alt={comment.authorDisplayName}
              title={comment.authorDisplayName}
              char={comment.authorDisplayName.charAt(0)}
              className="shrink-0 bg-zinc-200 dark:bg-zinc-600"
            />
            <div className="relative min-w-0 flex-1">
              {isOwner && (
                <div className="absolute right-0 top-0 flex flex-col gap-1.5 tn:flex-row tn:gap-1">
                  <Button
                    i={1}
                    s={1}
                    title="Delete comment"
                    onClick={() => setDeletingCommentId(comment.id)}
                  >
                    <BiTrash />
                  </Button>
                  <Button
                    i={1}
                    s={1}
                    title="Edit comment"
                    onClick={() => setEditingComment(comment)}
                  >
                    <BiPencil />
                  </Button>
                </div>
              )}
              <div className={c("mb-4 tn:mb-2", isOwner && ownerActionsPaddingClass)}>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {comment.authorDisplayName}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-300">
                  {comment.updatedAt}
                </p>
              </div>

              <p
                className={c(
                  "mb-1 text-sm leading-6 text-zinc-700 dark:text-zinc-300",
                  isOwner && ownerActionsPaddingClass,
                )}
              >
                {comment.content}
              </p>

              <footer className="flex items-center justify-end text-xs text-zinc-500 dark:text-zinc-300">
                <RatePopover
                  currentCategory={selected}
                  onSubmit={(category) => {
                    if (selected !== category) {
                      setBursts((current) => ({
                        ...current,
                        [id]: (current[id] ?? 0) + 1,
                      }));
                    }

                    ctx.rateComment(comment.id, category);
                  }}
                >
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-1 rounded-full border border-zinc-200 bg-white px-2.5 py-1.5 dark:border-zinc-400 dark:bg-zinc-900"
                    aria-label="Rate this comment"
                  >
                    {highlightIcon && (
                      <span className="inline-flex items-center justify-center gap-1 leading-none sm:hidden">
                        <CommentRatingIcon
                          commentId={comment.id}
                          category={highlightCategory}
                          Icon={highlightIcon.Icon}
                          count={comment.rating[highlightCategory]}
                          selected={selected}
                          burst={burst}
                        />
                        {totalRatingCount > 0 && (
                          <span
                            className={ratingTotalClass}
                            title="Total ratings"
                          >
                            ({totalRatingCount})
                          </span>
                        )}
                      </span>
                    )}
                    <span className="hidden items-center justify-center gap-1.5 leading-none sm:flex">
                      {RATING_ICONS.map(({ category, Icon }) => (
                        <CommentRatingIcon
                          key={`${comment.id}-${category}`}
                          commentId={comment.id}
                          category={category}
                          Icon={Icon}
                          count={comment.rating[category]}
                          selected={selected}
                          burst={burst}
                        />
                      ))}
                    </span>
                  </button>
                </RatePopover>
              </footer>
            </div>
          </article>
        );
      })}
    </div>
    {editingComment !== null && (
      <CommentEditModal
        comment={editingComment}
        onClose={() => setEditingComment(null)}
      />
    )}
    {deletingCommentId !== null && (
      <CommentDeleteModal
        commentId={deletingCommentId}
        onClose={() => setDeletingCommentId(null)}
      />
    )}
    </>
  );
};

const CommentsBody = ({
  isInViewport,
  expanded,
  onExpand,
}: {
  isInViewport: boolean;
  expanded: boolean;
  onExpand: () => void;
}) => {
  const ctx = useContext();
  const state = ctx.useComments();
  const hasKnownComments = state.totalCount > 0;
  const isLoading = state.isLoading && !state.loaded;
  const isIdle = !state.loaded && !state.isLoading && !state.error;

  const showExpandAffordance =
    !expanded &&
    (isLoading ||
      (isIdle && hasKnownComments) ||
      (state.loaded &&
        state.data.length > 0 &&
        (state.hasMore || state.data.length > 1)));

  const expandLabel = isLoading ? "Loading comments" : "Show all";

  let inner: React.ReactNode = null;

  const emptyPreview = (
    <Empty className="h-full">
      <Empty.Icon>
        <BiCommentAdd size={80} />
      </Empty.Icon>
      <Empty.Title>No comments yet</Empty.Title>
      <Empty.Description className="mb-0">
        Be the first to share your thoughts.
      </Empty.Description>
    </Empty>
  );

  if (state.error && !state.loaded) {
    inner = (
      <Err className="h-full">
        <Err.Icon>
          <BiError size={80} />
        </Err.Icon>
        <Err.Title>Something went wrong!</Err.Title>
        <Err.Description>{state.error}</Err.Description>
        <Err.Action
          title="Retry loading comments"
          auto
          s={2}
          i={2}
          disabled={state.isLoading}
          onClick={() => ctx.loadComments()}
        >
          Try Again
        </Err.Action>
      </Err>
    );
  } else if (state.loaded && state.data.length === 0) {
    inner = <CommentsFadeIn>{emptyPreview}</CommentsFadeIn>;
  } else if (isIdle && !hasKnownComments) {
    inner = emptyPreview;
  } else if (isLoading || (isIdle && hasKnownComments)) {
    inner = (
      <Placeholder
        count={state.totalCount}
        items={2}
        className={
          isIdle && !isInViewport ? "opacity-35 dark:opacity-25" : undefined
        }
      />
    );
  } else if (state.loaded && state.data.length > 0) {
    inner = (
      <CommentsFadeIn>
        <List />
        {expanded && state.hasMore && (
          <div className="mt-3 flex justify-center">
            <button
              type="button"
              className={commentsActionButtonClass}
              disabled={state.isLoadingMore}
              title="Load more comments"
              onClick={() => ctx.loadMoreComments()}
            >
              <BiChevronDown aria-hidden="true" size={20} className="shrink-0" />
              Load More Comments
            </button>
          </div>
        )}
      </CommentsFadeIn>
    );
  }

  return (
    <CommentsPreviewShell
      expanded={expanded}
      onExpand={onExpand}
      showExpandAffordance={showExpandAffordance}
      expandLabel={expandLabel}
    >
      {inner}
    </CommentsPreviewShell>
  );
};

const CommentsPanel = ({ isInViewport }: { isInViewport: boolean }) => {
  const ctx = useContext();
  const state = ctx.useComments();
  const [expanded, setExpanded] = React.useState(false);
  const inputDisabled = state.isLoading && !state.loaded;

  const expand = () => {
    setExpanded(true);

    if (!state.loaded && !state.isLoading && !state.error) {
      ctx.loadComments();
    }
  };

  React.useEffect(() => {
    if (
      state.loaded &&
      state.data.length > 0 &&
      state.data.length === 1 &&
      !state.hasMore
    ) {
      setExpanded(true);
    }
  }, [state.loaded, state.data.length, state.hasMore]);

  return (
    <div className={cardClass}>
      <CommentsHeader />
      <CommentInput disabled={inputDisabled} />
      <CommentsBody
        isInViewport={isInViewport}
        expanded={expanded}
        onExpand={expand}
      />
    </div>
  );
};

export const Comments = (props: ComponentProps<"section">) => {
  const ctx = useContext();
  const state = ctx.useComments();
  const { ref, isInViewport } = useInViewport<HTMLElement>({ once: true });

  React.useEffect(() => {
    if (!isInViewport || state.loaded || state.isLoading || state.error) {
      return;
    }

    ctx.loadComments();
  }, [ctx, isInViewport, state.loaded, state.isLoading, state.error]);

  return (
    <section aria-label="Comments" {...props} ref={ref}>
      <CommentsPanel isInViewport={isInViewport} />
    </section>
  );
};
