import { Button } from 'design-system/button';
import { Modal } from 'design-system/modal';
import React, { type ReactNode } from 'react';
import {
  BiArrowToLeft,
  BiArrowToRight,
  BiCheck,
  BiCopyAlt,
  BiMenu,
} from 'react-icons/bi';
import { Markdown } from './markdown';
import { useKeyPress } from 'development-kit/use-key-press';
import { falsy } from 'development-kit/guards';
import { useCopy } from 'development-kit/use-copy';
import { Status } from 'design-system/status';
import { useIsChaptersView } from 'store/chapters/chapters.store';
import c from 'classnames';
import {
  extractHeadings,
  type ExtractedHeading,
} from 'development-kit/extract-headings';

const isAbleToPrev = (activeSectionIndex: number): boolean =>
  activeSectionIndex > 0;

const isAbleToNext = (
  activeSectionIndex: number,
  sectionsLength: number,
): boolean => activeSectionIndex <= sectionsLength - 2;

const ChaptersModal = ({
  children,
  controls,
  onClose,
}: {
  children: string;
  controls?: ReactNode;
  onClose(): void;
}) => {
  const modalId = React.useId();
  const markdownContainerId = React.useId();

  const [activeSectionIndex, setActiveSectionIndex] = React.useState(0);
  const [copyState, copy] = useCopy();
  const isChaptersView = useIsChaptersView();
  const [isTableOfContentOpen, setIsTableOfContentOpen] = React.useState(false);
  const [activeHash, setActiveHash] = React.useState(``);

  const chapters = React.useMemo(() => {
    const parts = children.split(`\n`);
    const headingPositions: number[] = [];
    let introEnd = parts.length;

    for (let i = 0; i < parts.length; i++) {
      if (/^##\s.+$/.test(parts[i])) {
        headingPositions.push(i);
        if (introEnd === parts.length) introEnd = i;
      }
    }

    const introContent = parts.slice(0, introEnd).join(`\n`).trim();
    const intro = introContent ? [introContent] : [];

    const rest = headingPositions.map((start, index) => {
      const end = headingPositions[index + 1] ?? parts.length;
      return parts.slice(start, end).join(`\n`).trim();
    });

    return [...intro, ...rest];
  }, [children]);

  const allHeadings = React.useMemo(
    () => extractHeadings(children),
    [children],
  );

  const headingsForToc = React.useMemo(() => {
    if (isChaptersView) {
      return allHeadings.filter((heading) => heading.level === 2);
    }
    return allHeadings;
  }, [isChaptersView, allHeadings]);

  const content = isChaptersView ? chapters[activeSectionIndex] : children;

  const openToc = () => setIsTableOfContentOpen(true);
  const closeToc = () => setIsTableOfContentOpen(false);

  const handleTocItemClick = (heading: ExtractedHeading) => {
    closeToc();

    if (isChaptersView) {
      const chapterIndex = chapters.findIndex((chapter) =>
        chapter.trim().startsWith(`## ${heading.text}`),
      );
      setActiveSectionIndex(chapterIndex);
    } else {
      const url = new URL(window.location.href);
      const newHash = encodeURIComponent(heading.text);
      url.hash = newHash;

      window.history.replaceState(null, ``, url.toString());
      setActiveHash(newHash);

      const container = document.getElementById(markdownContainerId);
      if (!container) return;

      const headings = container.querySelectorAll(`h${heading.level}`);
      const targetHeading = Array.from(headings).find(
        (h) => h.textContent === heading.text,
      );
      targetHeading?.scrollIntoView({ behavior: `smooth`, block: `center` });
    }
  };

  const goToPreviousSection = (): void => {
    if (!isChaptersView || !isAbleToPrev(activeSectionIndex)) return;
    setActiveSectionIndex((prevIndex) => prevIndex - 1);
  };

  const goToNextSection = (): void => {
    if (!isChaptersView || !isAbleToNext(activeSectionIndex, chapters.length))
      return;
    setActiveSectionIndex(activeSectionIndex + 1);
  };

  const copyActiveChapter = (): void => {
    copy(isChaptersView ? content : children);
  };

  useKeyPress([`a`, `A`], goToPreviousSection);
  useKeyPress([`d`, `D`], goToNextSection);

  React.useLayoutEffect(() => {
    const modal = document.getElementById(markdownContainerId);
    falsy(modal, `Cannot find ${markdownContainerId}`);
    if (isChaptersView) {
      modal.scrollTo({ top: 0 });
    }
  }, [activeSectionIndex, isChaptersView, markdownContainerId]);

  React.useLayoutEffect(() => {
    if (isChaptersView) {
      setActiveHash(``);
      const url = new URL(window.location.href);
      if (url.hash) {
        url.hash = ``;
        window.history.replaceState(null, ``, url.toString());
      }
      return;
    }

    const handleHashChange = () => {
      setActiveHash(window.location.hash.slice(1));
    };

    handleHashChange();

    window.addEventListener(`hashchange`, handleHashChange);

    return () => {
      window.removeEventListener(`hashchange`, handleHashChange);
    };
  }, [isChaptersView]);

  const ableToPrev = isChaptersView && isAbleToPrev(activeSectionIndex);
  const ableToNext =
    isChaptersView && isAbleToNext(activeSectionIndex, chapters.length);

  return (
    <>
      <Modal
        id={modalId}
        className="[&>*]:w-[100%] [&>*]:max-w-3xl [&>*]:p-0 md:[&>*]:rounded-lg [&>*]:rounded-none md:!p-4 !p-0 [&>*]:flex [&>*]:flex-col [&>*]:max-h-screen md:[&>*]:max-h-[95vh] [&>*]:relative [&>*]:overflow-hidden"
        onClose={onClose}
      >
        <Modal.Header
          className="p-4 border-b border-zinc-300 dark:border-zinc-800 !mb-0"
          title={
            isChaptersView
              ? `Chapter (${activeSectionIndex + 1}/${chapters.length})`
              : `Article`
          }
          closeButtonTitle="Close display as a book mode (Esc)"
        >
          <div className="flex items-center gap-2">
            {controls}
            {headingsForToc.length > 0 && (
              <Button i={2} s={1} title="Table of Contents" onClick={openToc}>
                <BiMenu />
              </Button>
            )}
          </div>
        </Modal.Header>

        <main id={markdownContainerId} className="overflow-y-auto flex-1">
          <Markdown className="p-4 !max-w-full">{content}</Markdown>
        </main>

        <footer className="flex items-center justify-end p-4 gap-2 py-3 border-t border-zinc-300 dark:border-zinc-800">
          <Button
            i={2}
            s={1}
            title="Copy this content markdown (C)"
            onClick={copyActiveChapter}
          >
            {copyState.is === `copied` ? (
              <BiCheck className="text-green-700" />
            ) : (
              <BiCopyAlt />
            )}
          </Button>
          {(ableToPrev || ableToNext) && (
            <div className="h-4 w-0.5 mx-1 bg-zinc-300 dark:bg-zinc-800" />
          )}
          {ableToPrev && (
            <Button
              i={2}
              s={1}
              title="Go to previous chapter (A)"
              onClick={goToPreviousSection}
            >
              <BiArrowToLeft />
            </Button>
          )}
          {ableToNext && (
            <Button
              i={2}
              s={1}
              title="Go to next chapter (D)"
              onClick={goToNextSection}
            >
              <BiArrowToRight />
            </Button>
          )}
        </footer>

        {isTableOfContentOpen && (
          <div
            className="absolute inset-0 bg-black/50 z-10 animate-fade-in"
            onClick={closeToc}
            aria-hidden="true"
          />
        )}

        <aside
          className={c(
            `absolute top-0 bottom-0 right-0 z-20 w-full max-w-xs bg-white dark:bg-black shadow-lg transform transition-transform duration-300 ease-in-out flex flex-col`,
            isTableOfContentOpen ? `translate-x-0` : `translate-x-full`,
          )}
        >
          <header className="p-4 border-b border-zinc-300 dark:border-zinc-800">
            <h2 className="text-lg font-semibold">Table of Contents</h2>
          </header>
          <ul className="space-y-1.5 p-4 overflow-y-auto flex-1 ">
            {headingsForToc.map((heading, index) => {
              const isActive = isChaptersView
                ? chapters[activeSectionIndex]?.includes(heading.text)
                : activeHash === encodeURIComponent(heading.text);

              return (
                <li key={index}>
                  <button
                    onClick={() => handleTocItemClick(heading)}
                    className={c(
                      `w-full text-left p-2 rounded-md transition-colors`,
                      isActive
                        ? `bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 font-semibold`
                        : `text-gray-900 dark:text-gray-300 hover:bg-gray-100 hover:dark:bg-gray-800`,
                    )}
                    style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}
                  >
                    {heading.text}
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>
      </Modal>
      {copyState.is === `copied` && <Status>Content markdown copied</Status>}
    </>
  );
};

export { ChaptersModal };
