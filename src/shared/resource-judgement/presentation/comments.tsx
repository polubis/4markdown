import React, { type ComponentProps } from "react";
import { c } from "design-system/c";
import { Avatar } from "design-system/avatar";
import { Button } from "design-system/button";
import { Skeleton } from "design-system/skeleton";
import { Err } from "design-system/err";
import type { RatingCategory } from "../domain/models";
import {
  RATING_BG_COLORS,
  RATING_BURST_COUNT,
  RATING_COLORS,
  RATING_ICONS,
} from "./config";
import { RatePopover } from "./rate-popover";
import { useContext } from "./context";
import {
  BiBulb,
  BiComment,
  BiCommentAdd,
  BiError,
  BiMessageSquareDetail,
  BiPlus,
  BiShieldQuarter,
  BiUserVoice,
} from "react-icons/bi";

const Placeholder = ({
  count,
  className,
}: {
  count: number;
  className?: string;
}) => {
  const items = Math.min(Math.max(count, 1), 3);

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
              className={c(
                "h-9 w-9 shrink-0 rounded-full",
                skeletonBar,
              )}
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

const Preload = () => {
  const ctx = useContext();
  const state = ctx.useComments();
  const hasAny = state.totalCount > 0;
  const load = () => void ctx.loadComments();

  return (
    <div
      className={c(
        "rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm",
        "dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-lg dark:shadow-black/50",
      )}
    >
      <header className="mb-3 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
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
          </div>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            {hasAny
              ? "See what the community is saying about this article."
              : "Be the first to share your thoughts on this article."}
          </p>
        </div>
        <Button
          auto
          s={1}
          i={1}
          onClick={load}
          title="Add comment"
        >
          <BiPlus />
          Add comment
        </Button>
      </header>

      <div
        className={c(
          "relative min-h-[280px] overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 p-6",
          "dark:border-zinc-500 dark:bg-zinc-800",
        )}
      >
        {hasAny && (
          <Placeholder
            count={state.totalCount}
            className="pointer-events-none absolute inset-0 overflow-hidden p-4 opacity-[0.28] dark:opacity-[0.22]"
          />
        )}

        <div className="absolute inset-0 bg-white/38 dark:bg-zinc-950/30" />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">
            {hasAny ? (
              <BiComment aria-hidden="true" size={36} />
            ) : (
              <BiCommentAdd aria-hidden="true" size={36} />
            )}
          </div>
          <h3 className="text-xl font-semibold leading-tight text-zinc-900 dark:text-zinc-100 md:text-2xl">
            {hasAny
              ? "Comments are waiting for you"
              : "No comments yet"}
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-zinc-700 dark:text-zinc-200">
            {hasAny
              ? "Join the conversation and see what others think about this article."
              : "Start the discussion — your comment can help others learn."}
          </p>
          {hasAny ? (
            <Button
              auto
              s={1}
              i={2}
              className="mt-5 mx-auto"
              onClick={load}
              title="Load comments"
            >
              <BiComment />
              Load comments
            </Button>
          ) : (
            <Button
              auto
              s={1}
              i={2}
              className="mt-5 mx-auto"
              onClick={load}
              title="Add comment"
            >
              <BiPlus />
              Add comment
            </Button>
          )}
        </div>
      </div>

      <div className="mt-4 grid gap-3 pt-4 text-sm md:grid-cols-3">
        <div className="flex items-start gap-2">
          <span className="mt-0.5 rounded-full bg-blue-100 p-1.5 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">
            <BiUserVoice size={14} />
          </span>
          <div>
            <p className="font-semibold text-zinc-900 dark:text-zinc-100">
              Join the discussion
            </p>
            <p className="text-xs text-zinc-600 dark:text-zinc-300">
              Share your thoughts and learn from others
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <span className="mt-0.5 rounded-full bg-emerald-100 p-1.5 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300">
            <BiShieldQuarter size={14} />
          </span>
          <div>
            <p className="font-semibold text-zinc-900 dark:text-zinc-100">
              Respectful community
            </p>
            <p className="text-xs text-zinc-600 dark:text-zinc-300">
              All comments are moderated for quality
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <span className="mt-0.5 rounded-full bg-amber-100 p-1.5 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300">
            <BiBulb size={14} />
          </span>
          <div>
            <p className="font-semibold text-zinc-900 dark:text-zinc-100">
              Add value
            </p>
            <p className="text-xs text-zinc-600 dark:text-zinc-300">
              Your perspective helps the community grow
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Loading = () => {
  const state = useContext().useComments();

  return (
    <div
      className={c(
        "rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm",
        "dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-lg dark:shadow-black/50",
      )}
    >
      <header className="mb-3 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
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
          </div>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            Loading comments...
          </p>
        </div>
        <Button auto s={1} i={1} title="Add comment" disabled>
          <BiPlus />
          Add comment
        </Button>
      </header>
      <Placeholder count={state.totalCount} />
    </div>
  );
};

const ErrorView = () => {
  const ctx = useContext();

  return (
    <div
      className={c(
        "rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm",
        "dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-lg dark:shadow-black/50",
      )}
    >
      <Err className="border border-zinc-300 dark:border-zinc-800 rounded-lg p-6">
        <Err.Icon>
          <BiError size={80} />
        </Err.Icon>
        <Err.Title>Something went wrong!</Err.Title>
        <Err.Description>Failed to load comments. Please try again.</Err.Description>
        <Err.Action
          title="Retry loading comments"
          auto
          s={2}
          i={2}
          onClick={() => void ctx.loadComments()}
        >
          Try Again
        </Err.Action>
      </Err>
    </div>
  );
};

const Empty = () => {
  return (
    <div
      className={c(
        "flex flex-col items-center justify-center py-10 text-center",
        "rounded-xl border border-zinc-200 bg-zinc-50",
        "dark:border-zinc-500 dark:bg-zinc-800",
      )}
    >
      <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">
        <BiCommentAdd aria-hidden="true" size={30} />
      </div>
      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        No comments yet
      </p>
      <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-300">
        Be the first to share your thoughts.
      </p>
    </div>
  );
};

const List = () => {
  const state = useContext().useComments();
  const [ratings, setRatings] = React.useState<
    Record<string, RatingCategory | null>
  >({});
  const [bursts, setBursts] = React.useState<
    Record<string, number>
  >({});

  return (
    <div className="space-y-3">
      {state.data.map((comment) => {
        const id = String(comment.id);
        const selected = ratings[id] ?? null;
        const burst = bursts[id] ?? 0;

        return (
          <article
            key={comment.id}
            className={c(
              "rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 shadow-sm",
              "dark:border-zinc-500 dark:bg-zinc-800",
            )}
          >
            <header className="mb-2 flex items-start gap-3">
              <Avatar
                size="sm"
                src={comment.authorAvatarUrl ?? undefined}
                alt={comment.authorDisplayName}
                title={comment.authorDisplayName}
                char={comment.authorDisplayName.charAt(0)}
                className="shrink-0 bg-zinc-200 dark:bg-zinc-600"
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {comment.authorDisplayName}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-300">
                  {comment.createdAt}
                </p>
              </div>
            </header>

            <p className="mb-3 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
              {comment.content}
            </p>

            <footer className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-300">
              <button
                type="button"
                className="hover:text-zinc-900 hover:underline dark:hover:text-zinc-100"
              >
                Reply
              </button>
              <button
                type="button"
                className="hover:text-zinc-900 hover:underline dark:hover:text-zinc-100"
              >
                View {comment.repliesCount} replies
              </button>
              <RatePopover
                currentCategory={selected}
                onSubmit={(category) => {
                  setRatings((prev) => {
                    const previous = prev[id] ?? null;

                    if (previous !== category) {
                      setBursts((current) => ({
                        ...current,
                        [id]: (current[id] ?? 0) + 1,
                      }));
                    }

                    return {
                      ...prev,
                      [id]: category,
                    };
                  });
                }}
              >
                <button
                  type="button"
                  className="ml-auto flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-2 py-1 dark:border-zinc-400 dark:bg-zinc-900"
                  aria-label="Rate this comment"
                >
                  {RATING_ICONS.map(({ category, Icon }) => (
                    <span
                      key={`${comment.id}-${category}`}
                      className="inline-flex items-center gap-1"
                    >
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
                            key={`${comment.id}-${category}-${burst}`}
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 flex items-center justify-center"
                          >
                            <span className="relative h-0 w-0">
                              {Array.from({
                                length: RATING_BURST_COUNT[category],
                              }).map((_, i, arr) => {
                                const span = 140;
                                const angle =
                                  arr.length === 1
                                    ? -90
                                    : -90 -
                                      span / 2 +
                                      (i * span) / (arr.length - 1);
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
                              })}
                            </span>
                          </span>
                        )}
                      </span>
                      <span className="text-sm font-semibold leading-none text-zinc-700 dark:text-zinc-200">
                        {comment.rating[category]}
                      </span>
                    </span>
                  ))}
                </button>
              </RatePopover>
            </footer>
          </article>
        );
      })}
    </div>
  );
};

const Loaded = () => {
  const ctx = useContext();
  const state = ctx.useComments();

  return (
    <div
      className={c(
        "rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm",
        "dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-lg dark:shadow-black/50",
      )}
    >
      <header className="mb-3 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
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
          </div>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            Community feedback is now visible below.
          </p>
        </div>
        <Button auto s={1} i={1} title="Add comment">
          <BiPlus />
          Add comment
        </Button>
      </header>

      {state.data.length === 0 ? (
        <Empty />
      ) : (
        <>
          <List />
          {state.hasMore && (
            <Button
              className="mt-4 ml-auto"
              s={1}
              i={2}
              auto
              disabled={state.isLoadingMore}
              onClick={() => void ctx.loadMoreComments()}
              title="Load more comments"
            >
              Load More Comments
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export const Comments = (props: ComponentProps<"section">) => {
  const state = useContext().useComments();

  if (state.isLoading) {
    return (
      <section aria-label="Comments" {...props}>
        <Loading />
      </section>
    );
  }

  if (state.error && !state.loaded) {
    return (
      <section aria-label="Comments" {...props}>
        <ErrorView />
      </section>
    );
  }

  if (!state.loaded) {
    return (
      <section aria-label="Comments" {...props}>
        <Preload />
      </section>
    );
  }

  return (
    <section aria-label="Comments" {...props}>
      <Loaded />
    </section>
  );
};
