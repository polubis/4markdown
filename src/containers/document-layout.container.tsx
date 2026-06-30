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
  Atoms,
  SetUserResourceCompletionPayloadWithoutCompleted,
} from "api-4markdown-contracts";
import { useCopy } from "development-kit/use-copy";
import { ResourceContributionContainer } from "modules/resource-contribution";
import { useAuthStart } from "core/use-auth-start";
import Popover from "design-system/popover";
import { c } from "design-system/c";
import { useReadingTime } from "development-kit/use-reading-time";
import {
  Meter,
  ResourceJudgementProvider,
  RateSummary,
  ScoreSummary,
  CommentsSummary,
  RatePicker,
  ScorePicker,
  Comments,
} from "../shared/resource-judgement";

const MarkdownWidget = React.lazy(() =>
  import("components/markdown-widget").then(({ MarkdownWidget }) => ({
    default: MarkdownWidget,
  })),
);

const DocumentChangeHistoryContainer = React.lazy(() =>
  import("containers/document-change-history.container").then(
    ({ DocumentChangeHistoryContainer }) => ({
      default: DocumentChangeHistoryContainer,
    }),
  ),
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
  const [{ document }] = useDocumentLayoutContext();
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

  return (
    <ResourceJudgementProvider
      resourceId={document.id}
      resourceType="document"
      rating={document.rating}
      score={document.score}
      commentsCount={document.commentsCount}
    >
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
          </section>
          <section className="mb-6 ml-auto flex flex-wrap items-center justify-end gap-2">
            <RateSummary />
            <ScoreSummary />
            <CommentsSummary />
          </section>
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

          <section className="mt-14 mb-4 flex items-start justify-center gap-8">
            <ScorePicker mirrored />
            <RatePicker />
          </section>

          <section className="mt-8 mb-6" aria-label="Bullshit Meter">
            <Meter label="Bullshit Meter" />
          </section>

          <section id={COMMENTS_CONTAINER_ID}>
            <Comments />
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
        <React.Suspense>
          <DocumentChangeHistoryContainer onClose={changeHistoryModal.off} />
        </React.Suspense>
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
    </ResourceJudgementProvider>
  );
};

export { DocumentLayoutContainer };
