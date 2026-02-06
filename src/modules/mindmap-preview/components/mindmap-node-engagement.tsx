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
import { rateMindmapNodeAct } from "../../../acts/rate-mindmap-node.act";

type MindmapNodeEngagementProps = {
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
  const [commentsCount, setCommentsCount] = React.useState(
    initialCommentsCount ?? 0,
  );
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
        mindmapNodeId: nodeId,
        score: value,
      }),
    );
  };

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

    rateMindmapNode({ mindmapNodeId: nodeId, category });
  };

  return (
    <>
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative">
          <Button
            i={2}
            s={1}
            title="Rate this node"
            onClick={() => ratePopover.on()}
          >
            <BiHappy />
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
          popoverClassName="left-0 bottom-full -translate-y-2 w-[260px]"
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
              mindmapNodeId={nodeId}
              commentsCount={commentsCount}
              onCountChange={setCommentsCount}
              className="p-1"
            />
          </Modal2.Body>
        </Modal2>
      )}
    </>
  );
};

export { MindmapNodeEngagement };
