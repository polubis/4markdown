import React from "react";
import { Badge } from "design-system/badge";
import { Avatar } from "design-system/avatar";
import {
  BiBook,
  BiCheck,
  BiCheckSquare,
  BiCopyAlt,
  BiDotsHorizontal,
  BiEdit,
  BiHistory,
  BiLogoMarkdown,
  BiStar,
  BiSolidCheckSquare,
  BiSolidStar,
  BiTimeFive,
} from "react-icons/bi";
import { Button } from "design-system/button";
import { seeInDocumentsCreatorAct } from "acts/see-in-documents-creator.act";
import { Link, navigate } from "gatsby";
import { meta } from "../../meta";
import { useDocumentLayoutContext } from "providers/document-layout.provider";
import { SocialShare } from "components/social-share";
import { DocumentRatingContainer } from "containers/document-rating.container";
import { UserSocials } from "components/user-socials";
import { ScrollToTop } from "components/scroll-to-top";
import { Markdown } from "components/markdown";
import { useSimpleFeature } from "@greenonsoftware/react-kit";
import { TableOfContent } from "components/table-of-content";
import {
  useResourceCompletion,
  useResourceCompletionToggle,
  useResourcesCompletionState,
} from "modules/resource-completions";
import {
  useResourceLikeToggle,
  useResourcesLikeState,
  type SetUserResourceLikePayloadWithoutLiked,
} from "modules/resource-likes";
import {
  API4MarkdownDto,
  Atoms,
  SetUserResourceCompletionPayloadWithoutCompleted,
} from "api-4markdown-contracts";
import { CommentTrigger } from "components/comment-trigger";
import { DocumentCommentsModule } from "modules/document-comments";
import { ScorePicker } from "components/score-picker";
import { useCopy } from "development-kit/use-copy";
import { useMutation2 } from "core/use-mutation-2";
import { getAPI } from "api-4markdown";
import { toast } from "design-system/toast";
import { DocumentChangeHistoryContainer } from "containers/document-change-history.container";
import { ResourceContributionContainer } from "modules/resource-contribution";
import { useAuthStart } from "core/use-auth-start";
import Popover from "design-system/popover";
import { c } from "design-system/c";
import { useReadingTime } from "development-kit/use-reading-time";
import { BullshitMeter } from "components/bullshit-meter";

const MarkdownWidget = React.lazy(() =>
  import("components/markdown-widget").then(({ MarkdownWidget }) => ({
    default: MarkdownWidget,
  })),
);

const ReadingTimeMetric = React.memo(
  ({ markdown, className }: { className?: string; markdown: string }) => {
    const { minutesCount } = useReadingTime(markdown);
    const text = `${minutesCount}m`;

    return (
      <div
        className={c(
          "flex text-sm gap-1.5 items-center px-2 border rounded-md w-fit py-1 border-zinc-300 dark:border-zinc-800",
          "text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-900/80",
          className,
        )}
      >
        <BiTimeFive aria-hidden="true" />
        <span>{text}</span>
      </div>
    );
  },
);
const CONTENT_ID = `document-layout-content`;
const COMMENTS_CONTAINER_ID = `document-layout-comments`;
const EMPTY_RATING: Atoms["Rating"] = {
  ugly: 0,
  bad: 0,
  decent: 0,
  good: 0,
  perfect: 0,
};

const toBullshitScoreAverage = (scoreAverage: number): number => {
  if (scoreAverage <= 0) {
    return 0;
  }

  return 11 - scoreAverage;
};

const toBullshitScoreValue = (
  scoreValue: Atoms["ScoreValue"],
): Atoms["ScoreValue"] => {
  return (11 - scoreValue) as Atoms["ScoreValue"];
};

const ResourceCompletionTriggerContainer = () => {
  const [{ document }] = useDocumentLayoutContext();
  const toggleConfig =
    React.useMemo<SetUserResourceCompletionPayloadWithoutCompleted>(
      () => ({
        type: "document",
        resourceId: document.id as Atoms["DocumentId"],
        title: document.name,
        ...("description" in document && document.description
          ? { description: document.description }
          : {}),
      }),
      [document],
    );
  const [toggleState, completion, toggle] =
    useResourceCompletionToggle(toggleConfig);
  const resourcesCompletionState = useResourcesCompletionState();

  // @TODO[PRIO=2]: [Handle error case with some toast or error message].
  return (
    <Button
      s={2}
      i={2}
      disabled={
        toggleState.is === `busy` || resourcesCompletionState.is === `busy`
      }
      auto
      onClick={toggle}
    >
      {completion ? (
        <>
          Uncomplete <BiSolidCheckSquare size={24} />
        </>
      ) : (
        <>
          Complete <BiCheckSquare size={24} />
        </>
      )}
    </Button>
  );
};

const ResourceCompletionMarkerContainer = () => {
  const [{ document }] = useDocumentLayoutContext();
  const completion = useResourceCompletion(document.id as Atoms["DocumentId"]);

  if (!completion) {
    return null;
  }

  return (
    <p className="mb-6 flex gap-1 text-sm justify-center items-center border bg-zinc-200 dark:bg-gray-950 border-zinc-300 dark:border-zinc-800 p-2 rounded-md">
      <BiSolidCheckSquare className="shrink-0" size={24} />
      <span>
        You're browsing already <strong>completed resource</strong>.
      </span>
    </p>
  );
};

const ResourceLikeTriggerContainer = () => {
  const [{ document }] = useDocumentLayoutContext();
  const [toggleConfig] = React.useState<SetUserResourceLikePayloadWithoutLiked>(
    () => ({
      type: "document",
      resourceId: document.id as Atoms["DocumentId"],
      title: document.name,
      ...("description" in document && document.description
        ? { description: document.description }
        : {}),
    }),
  );
  const [toggleState, like, toggle] = useResourceLikeToggle(toggleConfig);
  const resourcesLikeState = useResourcesLikeState();

  // @TODO[PRIO=2]: [Handle error case with some toast or error message].
  return (
    <Button
      s={2}
      i={2}
      disabled={toggleState.is === `busy` || resourcesLikeState.is === `busy`}
      auto
      onClick={toggle}
    >
      {like ? (
        <>
          Unstar <BiSolidStar />
        </>
      ) : (
        <>
          Star <BiStar />
        </>
      )}
    </Button>
  );
};

const DocumentLayoutContainer = () => {
  const [{ document }, setDocumentLayoutState] = useDocumentLayoutContext();
  const { code, author } = document;
  const sectionsModal = useSimpleFeature();
  const changeHistoryModal = useSimpleFeature();
  const contributionModal = useSimpleFeature();
  const moreMenuModal = useSimpleFeature();
  const [copyState, copy] = useCopy();
  const startAuth = useAuthStart();
  const isCompleted = useResourceCompletion(document.id as Atoms["DocumentId"]);

  const openInDocumentsCreator = (): void => {
    seeInDocumentsCreatorAct({ code });
    navigate(meta.routes.home);
  };

  const addScoreMutation = useMutation2<API4MarkdownDto<"addDocumentScore">>({
    onFail: (error) => {
      toast.error({
        title: "Failed to add score",
        children: error.message,
      });
    },
    onOk: (data) => {
      setDocumentLayoutState(({ document, yourRate }) => ({
        document: {
          ...document,
          score: {
            average: data.average,
            count: data.count,
            values: data.values,
          },
        },
        yourRate,
      }));
    },
  });

  const addScore = (score: Atoms["ScoreValue"]): void => {
    addScoreMutation.start(() =>
      getAPI().call("addDocumentScore")({ documentId: document.id, score }),
    );
  };

  const bullshitMeterData = React.useMemo(
    () => ({
      score: {
        scoreAverage: toBullshitScoreAverage(document.score.average),
        scoreCount: document.score.count,
        scoreValues: document.score.values.map(toBullshitScoreValue),
      },
      rating: "rating" in document ? document.rating : EMPTY_RATING,
      commentsCount: document.commentsCount,
    }),
    [document],
  );

  return (
    <>
      <div className="px-4 py-10 relative lg:flex lg:justify-center">
        <main className="max-w-prose w-full mx-auto mb-8 lg:mr-8 lg:mb-0 lg:mx-0">
          <ResourceCompletionMarkerContainer />
          <section className="flex items-center gap-2.5 mb-6 justify-end sm:justify-start">
            <div className="relative">
              <Button
                title="More options"
                s={2}
                i={2}
                onClick={moreMenuModal.on}
              >
                <BiDotsHorizontal />
              </Button>
              {moreMenuModal.isOn && (
                <Popover
                  className="!absolute flex gap-2 translate-y-2.5 left-0 w-fit !z-[15]"
                  onBackdropClick={moreMenuModal.off}
                >
                  <Button
                    title="Open in documents creator"
                    s={1}
                    i={2}
                    onClick={openInDocumentsCreator}
                  >
                    <BiLogoMarkdown />
                  </Button>
                  <Button
                    title="Copy this document markdown"
                    s={1}
                    i={2}
                    onClick={() => copy(code)}
                  >
                    {copyState.is === `copied` ? (
                      <BiCheck className="text-green-700" />
                    ) : (
                      <BiCopyAlt />
                    )}
                  </Button>
                  <Button
                    title="View change history"
                    s={1}
                    i={2}
                    onClick={() => changeHistoryModal.on()}
                  >
                    <BiHistory />
                  </Button>
                  <Button
                    title="Contribute improvements"
                    s={1}
                    i={2}
                    onClick={() => {
                      startAuth(() => contributionModal.on());
                    }}
                  >
                    <BiEdit className="shrink-0" />
                  </Button>
                </Popover>
              )}
            </div>
            <Button
              title="Display this document like a book"
              s={2}
              i={2}
              onClick={sectionsModal.on}
            >
              <BiBook />
            </Button>
            <SocialShare />
            <div className="ml-auto flex gap-2.5 items-center">
              <ScorePicker
                disabled={addScoreMutation.busy || addScoreMutation.ok}
                popoverClassName="-right-10 w-[280px]"
                average={document.score.average}
                count={document.score.count}
                onRate={addScore}
              />
              <CommentTrigger
                i={2}
                s={2}
                position="right"
                count={document.commentsCount}
                onClick={() => {
                  window.document
                    .getElementById(COMMENTS_CONTAINER_ID)
                    ?.scrollIntoView();
                }}
              />
            </div>
          </section>
          <DocumentRatingContainer className="mb-6 justify-end" />
          {document.visibility === `permanent` && (
            <section className="flex flex-wrap gap-2 items-center mb-4">
              {document.tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </section>
          )}
          <section className="mb-4">
            <ReadingTimeMetric markdown={code} />
          </section>
          <section id={CONTENT_ID}>
            <Markdown>{code}</Markdown>
          </section>
          <section className="mt-10 flex gap-2">
            <ResourceLikeTriggerContainer />
            <ResourceCompletionTriggerContainer />
          </section>
          {author?.bio && author?.displayName && (
            <section className="mt-12">
              <div className="flex max-w-xl space-x-5 ml-auto rounded-lg">
                <Avatar
                  className="shrink-0 bg-gray-300 dark:bg-slate-800"
                  size="md"
                  src={author.avatar?.md.src}
                  alt="Author avatar"
                  char={author.displayName.charAt(0)}
                />
                <div className="flex flex-col overflow-hidden">
                  <i>About Author</i>
                  <Link
                    to={
                      meta.routes.userProfile.preview +
                      `?profileId=${author.id}`
                    }
                    className="mb-2 text-black dark:text-white font-bold hover:underline underline-offset-4 w-fit"
                  >
                    {author.displayName}
                  </Link>
                  <p>{author.bio}</p>
                  <div className="flex space-x-2 mt-4">
                    <UserSocials
                      githubUrl={author.githubUrl}
                      linkedInUrl={author.linkedInUrl}
                      blogUrl={author.blogUrl}
                      twitterUrl={author.twitterUrl}
                      fbUrl={author.fbUrl}
                      createTitle={(title) => `Author ${title}`}
                    />
                  </div>
                </div>
              </div>
            </section>
          )}

          <div className="mt-10 mb-4 ml-auto w-fit">
            <ScorePicker
              disabled={addScoreMutation.busy || addScoreMutation.ok}
              popoverClassName="right-0 w-[280px]"
              average={document.score.average}
              count={document.score.count}
              onRate={addScore}
            />
          </div>

          <DocumentRatingContainer className="justify-end" />

          <section className="mt-8" aria-label="Bullshit Meter">
            <BullshitMeter
              score={bullshitMeterData.score}
              rating={bullshitMeterData.rating}
              commentsCount={bullshitMeterData.commentsCount}
            />
          </section>

          <section id={COMMENTS_CONTAINER_ID}>
            <DocumentCommentsModule
              documentId={document.id}
              onCountChange={(count) =>
                setDocumentLayoutState(({ document, yourRate }) => ({
                  yourRate,
                  document: { ...document, commentsCount: count },
                }))
              }
              commentsCount={document.commentsCount}
              className="mt-10"
            />
          </section>
        </main>
        <TableOfContent markdownContainerId={CONTENT_ID} markdown={code} />
      </div>

      <ScrollToTop />

      {sectionsModal.isOn && (
        <React.Suspense>
          <MarkdownWidget
            markdown={code}
            onClose={sectionsModal.off}
            resourceId={document.id as Atoms["DocumentId"]}
            resourceType="document"
            resourceCdate={document.cdate}
          />
        </React.Suspense>
      )}

      {changeHistoryModal.isOn && (
        <DocumentChangeHistoryContainer onClose={changeHistoryModal.off} />
      )}

      {contributionModal.isOn && (
        <ResourceContributionContainer
          input={{
            type: "document",
            documentId: document.id as Atoms["DocumentId"],
            currentContent: code,
            isCompleted: !!isCompleted,
          }}
          onClose={contributionModal.off}
        />
      )}
    </>
  );
};

export { DocumentLayoutContainer };
