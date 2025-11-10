import React from "react";
import { Avatar } from "design-system/avatar";
import { UserSocials } from "components/user-socials";
import { formatDistance } from "date-fns";
import { AddCommentTriggerContainer } from "./add-comment-trigger.container";
import { useUserProfileState } from "../store";
import { RatePicker } from "components/rate-picker";
import { ScorePicker } from "components/score-picker";
import { addUserProfileScoreAct } from "../acts/add-user-profile-score.act";
import { useFeature, useSimpleFeature } from "@greenonsoftware/react-kit";
import { useMutation2 } from "core/use-mutation-2";
import { toast } from "design-system/toast";
import { rateUserProfileAct } from "../acts/rate-user-profile.act";
import { Atoms } from "api-4markdown-contracts";
import { rateUserProfileCommentAct } from "../acts/rate-user-profile-comment.act";

const UserProfileStatsContainer = () => {
  const { stats } = useUserProfileState();
  const scoreAdded = useSimpleFeature();
  const [ratedComments, setRatedComments] = React.useState<
    Record<Atoms["UserProfileCommentId"], Atoms["RatingCategory"]>
  >({});

  const appliedRate = useFeature<Atoms["RatingCategory"]>();
  const scoreProfileMutation = useMutation2({
    onOk: () => {
      toast.success({
        title: "Score added. Thx!",
      });
      scoreAdded.on();
    },
    onFail: (error) => {
      toast.error({
        title: error.message,
      });
    },
  });

  const rateProfileMutation = useMutation2({
    onOk: () => {
      toast.success({
        title: "Rating added. Thx!",
      });
    },
    onFail: (error) => {
      toast.error({
        title: error.message,
      });
    },
  });

  const rateCommentMutation = useMutation2({
    onOk: () => {
      toast.success({
        title: "Comment rated. Thx!",
      });
    },
    onFail: (error) => {
      toast.error({
        title: error.message,
      });
    },
  });

  if (stats.is !== `ok`)
    throw Error(
      `User profile is not loaded yet but you are trying to render the stats`,
    );

  const { profile, comments } = stats;

  const hasSocials =
    profile.githubUrl ||
    profile.fbUrl ||
    profile.linkedInUrl ||
    profile.twitterUrl ||
    profile.blogUrl;

  return (
    <>
      <section className="max-w-3xl mx-auto w-full">
        <h1 className="text-4xl font-bold mb-6">User Profile</h1>
        <div className="p-4 rounded-lg border border-zinc-300 dark:border-zinc-800">
          <Avatar
            size="lg"
            alt="Your avatar"
            className="bg-gray-300 dark:bg-slate-800 mx-auto"
            char={
              profile.displayName ? profile.displayName.charAt(0) : undefined
            }
            src={profile.avatar?.lg.src}
          />
          <h2 className="text-2xl font-bold text-center my-3">
            {profile.displayName ?? "Anonymous"}
          </h2>
          <p className="text-center">{profile.bio ?? "No bio yet"}</p>
          {hasSocials && (
            <div className="mt-4 flex justify-center gap-2">
              <UserSocials
                githubUrl={profile.githubUrl}
                fbUrl={profile.fbUrl}
                linkedInUrl={profile.linkedInUrl}
                twitterUrl={profile.twitterUrl}
                blogUrl={profile.blogUrl}
                createTitle={(title) => `Your ${title}`}
              />
            </div>
          )}
        </div>
      </section>
      <section className="mt-4">
        <h3 className="text-xl mb-3">Rating</h3>
        <div className="p-4 rounded-lg border border-zinc-300 dark:border-zinc-800">
          <RatePicker
            className="mx-auto"
            disabled={appliedRate.is === `on` || rateProfileMutation.busy}
            rating={profile}
            rate={appliedRate.is === `on` ? appliedRate.data : null}
            onRate={(category) => {
              appliedRate.on(category);
              rateProfileMutation.start(() =>
                rateUserProfileAct({ userProfileId: profile.id, category }),
              );
            }}
          />
        </div>
        <h4 className="text-lg mt-4 mb-2">Trust Score</h4>
        <ScorePicker
          disabled={scoreAdded.isOn || scoreProfileMutation.busy}
          className="mr-1 w-full"
          average={profile.scoreAverage}
          count={profile.scoreCount}
          onRate={(score) =>
            scoreProfileMutation.start(() =>
              addUserProfileScoreAct({ userProfileId: profile.id, score }),
            )
          }
        />
      </section>
      <section className="mt-8">
        <AddCommentTriggerContainer />
      </section>
      {comments.length > 0 && (
        <section className="mt-10 max-w-7xl w-full">
          <h2 className="text-2xl font-bold mb-5">
            What People Say ({comments.length})
          </h2>
          <ul className="columns-1 md:columns-2 lg:columns-3 gap-4 [column-fill:_balance]">
            {comments.map((comment) => (
              <li
                key={comment.id}
                className="break-inside-avoid mb-4 p-4 flex flex-col rounded-lg border border-zinc-300 dark:border-zinc-800"
              >
                <div className="flex items-center gap-4">
                  <Avatar
                    size="md"
                    src={comment.ownerProfile.avatar?.md?.src}
                    alt={comment.ownerProfile.displayName ?? `Comment author`}
                    char={comment.ownerProfile.displayName?.charAt(0)}
                    className="shrink-0 bg-gray-300 dark:bg-slate-800"
                  />
                  <div className="flex flex-col">
                    <h3 className="text-lg font-bold leading-6 mb-1">
                      {comment.ownerProfile.displayName ?? `Anonymous`}
                    </h3>
                    <p className="text-sm">
                      {formatDistance(new Date(), comment.mdate, {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
                <p className="italic mt-4">{comment.content}</p>
                <RatePicker
                  className="[&_svg]:size-4 ml-auto mt-4"
                  disabled={ratedComments[comment.id] !== undefined}
                  rating={comment}
                  rate={ratedComments[comment.id]}
                  onRate={(category) => {
                    rateCommentMutation.start(() =>
                      rateUserProfileCommentAct({
                        commentId: comment.id,
                        profileId: profile.id,
                        category,
                      }),
                    );
                    setRatedComments((prev) => ({
                      ...prev,
                      [comment.id]: category,
                    }));
                  }}
                />
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
};

export { UserProfileStatsContainer };
