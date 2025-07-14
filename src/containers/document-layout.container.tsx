import React from "react";
import { Badge } from "design-system/badge";
import { Avatar } from "design-system/avatar";
import { BiBook, BiCheck, BiCopyAlt, BiLogoMarkdown } from "react-icons/bi";
import { Button } from "design-system/button";
import { useCopy } from "development-kit/use-copy";
import { Status } from "design-system/status";
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

const MarkdownWidget = React.lazy(() =>
  import("components/markdown-widget").then(({ MarkdownWidget }) => ({
    default: MarkdownWidget,
  })),
);

const CONTENT_ID = `document-layout-content`;

const DocumentLayoutContainer = () => {
  const [{ document }] = useDocumentLayoutContext();
  const { code, author } = document;
  const sectionsModal = useSimpleFeature();
  const [copyState, copy] = useCopy();

  const openInDocumentsCreator = (): void => {
    seeInDocumentsCreatorAct({ code });
    navigate(meta.routes.home);
  };

  return (
    <>
      <div className="px-4 py-10 relative lg:flex lg:justify-center">
        <main className="max-w-prose mx-auto mb-8 lg:mr-8 lg:mb-0 lg:mx-0">
          <section className="flex items-center gap-2.5 mb-6 justify-end sm:justify-start">
            <Button
              title="Open in documents creator"
              s={2}
              i={2}
              onClick={openInDocumentsCreator}
            >
              <BiLogoMarkdown />
            </Button>
            <Button
              title="Display this document like a book"
              s={2}
              i={2}
              onClick={sectionsModal.on}
            >
              <BiBook />
            </Button>
            <div className="h-5 w-0.5 mx-1 bg-zinc-300 dark:bg-zinc-800" />
            <SocialShare />
            <Button
              title="Copy this document markdown"
              s={2}
              i={2}
              onClick={() => copy(code)}
            >
              {copyState.is === `copied` ? (
                <BiCheck className="text-green-700" />
              ) : (
                <BiCopyAlt />
              )}
            </Button>
          </section>
          <DocumentRatingContainer className="mb-6 justify-end" />
          {document.visibility === `permanent` && (
            <section className="flex flex-wrap gap-2 items-center mb-4">
              {document.tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </section>
          )}
          <section id={CONTENT_ID}>
            <Markdown>{code}</Markdown>
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
          <DocumentRatingContainer className="mt-10 justify-end" />
        </main>
        <TableOfContent markdownContainerId={CONTENT_ID} markdown={code} />
      </div>

      <ScrollToTop />

      {sectionsModal.isOn && (
        <React.Suspense>
          <MarkdownWidget markdown={code} onClose={sectionsModal.off} />
        </React.Suspense>
      )}
      {copyState.is === `copied` && <Status>Document markdown copied</Status>}
    </>
  );
};

export { DocumentLayoutContainer };
