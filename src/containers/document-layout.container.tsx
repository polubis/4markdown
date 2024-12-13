import React from 'react';
import { Badge } from 'design-system/badge';
import { Avatar } from 'design-system/avatar';
import { BiBook, BiCheck, BiCopyAlt, BiLogoMarkdown } from 'react-icons/bi';
import c from 'classnames';
import { useToggle } from 'development-kit/use-toggle';
import { Button } from 'design-system/button';
import { useCopy } from 'development-kit/use-copy';
import { Status } from 'design-system/status';
import { seeInDocumentsCreatorAct } from 'acts/see-in-documents-creator.act';
import { navigate } from 'core/navigate';
import { meta } from '../../meta';
import { useDocumentLayoutContext } from 'providers/document-layout.provider';
import { SocialShare } from 'components/social-share';
import { DocumentRatingContainer } from 'containers/document-rating.container';
import { M } from 'components/markdown';
import { UserSocials } from 'components/user-socials';
import { ScrollToTop } from 'components/scroll-to-top';

const DocumentChaptersModal = React.lazy(() =>
  import(`../components/document-chapters-modal`).then((m) => ({
    default: m.DocumentChaptersModal,
  })),
);

const DocumentLayoutContainer = () => {
  const [{ document }] = useDocumentLayoutContext();
  const { code, author } = document;
  const sectionsModal = useToggle();
  const [copyState, copy] = useCopy();

  const openInDocumentsCreator = (): void => {
    seeInDocumentsCreatorAct({ code });
    navigate(meta.routes.home);
  };

  return (
    <>
      <main className="p-4 my-6">
        <section className="flex items-center ml-auto gap-2.5 mb-6 justify-end sm:justify-start max-w-4xl mx-auto">
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
            onClick={sectionsModal.open}
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
        <DocumentRatingContainer className="mb-6 justify-end max-w-4xl mx-auto" />
        {document.visibility === `permanent` && (
          <section className="flex flex-wrap gap-2 items-center mb-4 max-w-4xl mx-auto">
            {document.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </section>
        )}
        <article className={c(`max-w-4xl mx-auto`, M.className)}>
          <M>{code}</M>
        </article>
        {author?.bio && author?.displayName && (
          <section className="mt-12 max-w-4xl mx-auto">
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
                <strong className="mb-1 text-black dark:text-white">
                  {author.displayName}
                </strong>
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
        <DocumentRatingContainer className="mt-10 justify-end max-w-4xl mx-auto" />
      </main>
      <ScrollToTop />
      {sectionsModal.opened && (
        <React.Suspense>
          <DocumentChaptersModal onClose={sectionsModal.close}>
            {code}
          </DocumentChaptersModal>
        </React.Suspense>
      )}
      {copyState.is === `copied` && <Status>Document markdown copied</Status>}
    </>
  );
};

export { DocumentLayoutContainer };