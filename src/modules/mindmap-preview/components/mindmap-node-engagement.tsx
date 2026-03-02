import React from "react";
import throttle from "lodash.throttle";
import { useSimpleFeature } from "@greenonsoftware/react-kit";
import { API4MarkdownDto, Atoms } from "api-4markdown-contracts";
import { RatePicker } from "components/rate-picker";
import { ScorePicker } from "components/score-picker";
import { CommentTrigger } from "components/comment-trigger";
import { MindmapNodeCommentsModule } from "modules/mindmap-node-comments";
import { useMutation2 } from "core/use-mutation-2";
import { getAPI } from "api-4markdown";
import { toast } from "design-system/toast";
import { c } from "design-system/c";
import { Button } from "design-system/button";
import Popover from "design-system/popover";
import { Modal2 } from "design-system/modal2";
import { BiHappy } from "react-icons/bi";
import { RATING_ICONS } from "core/rating-config";
import { rateMindmapNodeAct } from "../../../acts/rate-mindmap-node.act";

type MindmapNodeEngagementProps = {
  mindmapId: Atoms["MindmapId"];
  nodeId: Atoms["MindmapNodeId"];
  initialRating?: Atoms["Rating"];
  initialScore?: {
    average: number;
    count: number;
    values: Atoms["ScoreValue"][];
  };
  initialCommentsCount?: number;
};

const EMPTY_RATING: Atoms["Rating"] = {
  perfect: 0,
  good: 0,
  decent: 0,
  bad: 0,
  ugly: 0,
};

const toFullRating = (rating?: Partial<Atoms["Rating"]>): Atoms["Rating"] => ({
  perfect: rating?.perfect ?? 0,
  good: rating?.good ?? 0,
  decent: rating?.decent ?? 0,
  bad: rating?.bad ?? 0,
  ugly: rating?.ugly ?? 0,
});

const rateMindmapNode = throttle(rateMindmapNodeAct, 5000);

const MindmapNodeEngagement = ({
  mindmapId,
  nodeId,
  initialRating,
  initialScore,
  initialCommentsCount,
}: MindmapNodeEngagementProps) => {
  const [rating, setRating] = React.useState<Atoms["Rating"]>(() =>
    initialRating ? toFullRating(initialRating) : EMPTY_RATING,
  );
  const [yourRate, setYourRate] = React.useState<
    Atoms["RatingCategory"] | null
  >(null);
  const commentsCount = initialCommentsCount ?? 0;
  const [score, setScore] = React.useState(() => ({
    average: initialScore?.average ?? 0,
    count: initialScore?.count ?? 0,
    values: initialScore?.values ?? [],
  }));
  const commentsModal = useSimpleFeature();
  const ratePopover = useSimpleFeature();

  const addScoreMutation = useMutation2<API4MarkdownDto<"addMindmapNodeScore">>(
    {
      onFail: (error) => {
        toast.error({
          title: "Failed to add score",
          children: error.message,
        });
      },
      onOk: (data) => {
        setScore({
          average: data.average,
          count: data.count,
          values: data.values,
        });
      },
    },
  );

  const addScore = (value: Atoms["ScoreValue"]): void => {
    addScoreMutation.start(() =>
      getAPI().call("addMindmapNodeScore")({
        mindmapId,
        nodeId,
        score: value,
      }),
    );
  };

  const [displayCategoryIndex, setDisplayCategoryIndex] =
    React.useState<number>(0);
  const [hasCompletedInitialCycle, setHasCompletedInitialCycle] =
    React.useState(false);
  const [isAnimatingCategoryChange, setIsAnimatingCategoryChange] =
    React.useState(false);
  const [swipeDirection, setSwipeDirection] = React.useState<"left" | "right">(
    "right",
  );

  const previousResolvedIndexRef = React.useRef<number>(0);

  React.useEffect(() => {
    if (yourRate) {
      const idx = RATING_ICONS.findIndex(
        ([, category]) => category === yourRate,
      );

      setDisplayCategoryIndex(idx === -1 ? 0 : idx);
      setHasCompletedInitialCycle(true);

      return;
    }

    if (hasCompletedInitialCycle) {
      return;
    }

    if (typeof window === "undefined") {
      return;
    }

    let currentIndex = 0;

    setDisplayCategoryIndex(0);

    const intervalId = window.setInterval(() => {
      currentIndex += 1;

      if (currentIndex >= RATING_ICONS.length - 1) {
        setDisplayCategoryIndex(RATING_ICONS.length - 1);
        setHasCompletedInitialCycle(true);
        window.clearInterval(intervalId);

        return;
      }

      setDisplayCategoryIndex(currentIndex);
    }, 1600);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [yourRate, hasCompletedInitialCycle]);

  const resolvedCategoryIndex = React.useMemo(() => {
    if (yourRate) {
      const idx = RATING_ICONS.findIndex(
        ([, category]) => category === yourRate,
      );

      if (idx !== -1) {
        return idx;
      }
    }

    return displayCategoryIndex;
  }, [yourRate, displayCategoryIndex]);

  React.useEffect(() => {
    if (previousResolvedIndexRef.current === resolvedCategoryIndex) {
      return;
    }

    const previousIndex = previousResolvedIndexRef.current;

    setSwipeDirection(resolvedCategoryIndex > previousIndex ? "right" : "left");

    previousResolvedIndexRef.current = resolvedCategoryIndex;

    setIsAnimatingCategoryChange(true);

    const timeoutId = window.setTimeout(() => {
      setIsAnimatingCategoryChange(false);
    }, 260);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [resolvedCategoryIndex]);

  const [CurrentRatingIcon, currentRatingCategory] = RATING_ICONS[
    resolvedCategoryIndex
  ] ?? [BiHappy, null];

  const handleRate = (category: Atoms["RatingCategory"]): void => {
    setYourRate((prevRate) => {
      setRating((currentRating) => {
        if (!prevRate) {
          return {
            ...currentRating,
            [category]: currentRating[category] + 1,
          };
        }

        if (prevRate === category) {
          return {
            ...currentRating,
            [category]: Math.max(0, currentRating[category] - 1),
          };
        }

        return {
          ...currentRating,
          [category]: currentRating[category] + 1,
          [prevRate]: Math.max(0, currentRating[prevRate] - 1),
        };
      });

      return prevRate === category ? null : category;
    });

    rateMindmapNode({ mindmapId, nodeId, category });
  };

  return (
    <>
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative">
          <Button
            i={2}
            s={2}
            className="min-w-16"
            auto
            title="Rate this node"
            onClick={() => ratePopover.on()}
          >
            <span
              className={c(
                "flex items-center gap-1 transition-all duration-200 ease-out",
                isAnimatingCategoryChange
                  ? swipeDirection === "right"
                    ? "opacity-0 translate-x-2"
                    : "opacity-0 -translate-x-2"
                  : "opacity-100 translate-x-0",
              )}
            >
              <CurrentRatingIcon className="mr-0.5 shrink-0" />
              {currentRatingCategory && (
                <strong className="text-xs">
                  {rating[currentRatingCategory] ?? 0}
                </strong>
              )}
            </span>
          </Button>
          {ratePopover.isOn && (
            <Popover
              className="!absolute flex flex-wrap gap-1 left-0 bottom-full -translate-y-2 w-fit"
              onBackdropClick={ratePopover.off}
            >
              <RatePicker
                className="flex-wrap gap-1"
                rating={rating}
                rate={yourRate}
                onRate={(category) => {
                  handleRate(category);
                  ratePopover.off();
                }}
              />
            </Popover>
          )}
        </div>
        <ScorePicker
          className="h-8 px-2 text-sm flex items-center justify-center"
          disabled={addScoreMutation.busy || addScoreMutation.ok}
          popoverClassName="left-0 bottom-full -translate-y-2 -translate-x-6 w-[260px]"
          average={score.average}
          count={score.count}
          onRate={addScore}
        />
        <CommentTrigger
          i={2}
          s={1}
          position="right"
          count={commentsCount}
          onClick={() => commentsModal.on()}
        />
      </div>
      {commentsModal.isOn && (
        <Modal2
          onClose={commentsModal.off}
          className={c("[&>*]:max-w-3xl [&>*]:h-full")}
        >
          <Modal2.Header
            title="Node Comments"
            closeButtonTitle="Close comments"
          />
          <Modal2.Body>
            <MindmapNodeCommentsModule
              mindmapId={mindmapId}
              mindmapNodeId={nodeId}
              commentsCount={commentsCount}
              className="p-1"
            />
          </Modal2.Body>
        </Modal2>
      )}
    </>
  );
};

export { MindmapNodeEngagement };
