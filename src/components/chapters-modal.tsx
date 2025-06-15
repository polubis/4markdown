import { Button } from 'design-system/button';
import { Modal } from 'design-system/modal';
import React, { type ReactNode } from 'react';
import {
  BiArrowToLeft,
  BiArrowToRight,
  BiCheck,
  BiCopyAlt,
  BiMenu, // Ikona dla spisu treści
} from 'react-icons/bi';
import { Markdown } from './markdown';
import { useKeyPress } from 'development-kit/use-key-press';
import { falsy } from 'development-kit/guards';
import { useCopy } from 'development-kit/use-copy';
import { Status } from 'design-system/status';
import { useIsChaptersView } from 'store/chapters/chapters.store';
import c from 'classnames';

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

    return [...intro, ...rest].filter(Boolean);
  }, [children]);

  const chapterHeadings = React.useMemo(() => {
    const introExists =
      chapters.length > 0 && !/^##\s.+$/.test(chapters[0].split(`\n`)[0]);

    return chapters.map((chapterContent, index) => {
      if (index === 0 && introExists) {
        return `Introduction`;
      }
      return chapterContent.split(`\n`)[0].replace(/^##\s*/, ``);
    });
  }, [chapters]);

  const content = isChaptersView ? chapters[activeSectionIndex] : children;

  const openToc = () => setIsTableOfContentOpen(true);
  const closeToc = () => setIsTableOfContentOpen(false);

  const handleTocItemClick = (headingText: string, index: number) => {
    closeToc();
    if (isChaptersView) {
      setActiveSectionIndex(index);
    } else {
      const container = document.getElementById(markdownContainerId);
      if (!container) return;

      const headings = container.querySelectorAll(`h2`);
      const targetHeading = Array.from(headings).find(
        (h) => h.textContent === headingText,
      );
      targetHeading?.scrollIntoView({ behavior: `smooth`, block: `start` });
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
  useKeyPress([`Escape`], closeToc); // Zamykanie ToC klawiszem Escape

  React.useLayoutEffect(() => {
    const modal = document.getElementById(markdownContainerId);
    falsy(modal, `Cannot find ${markdownContainerId}`);
    if (isChaptersView) {
      modal.scrollTo({ top: 0 });
    }
  }, [activeSectionIndex, isChaptersView, markdownContainerId]);

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
            {chapterHeadings.length > 0 && (
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
          <ul className="space-y-1.5 p-4 overflow-y-auto flex-1">
            {chapterHeadings.map((title, index) => (
              <li key={index}>
                <button
                  onClick={() => handleTocItemClick(title, index)}
                  className={c(
                    `w-full text-left p-2 rounded-md transition-colors`,
                    isChaptersView && activeSectionIndex === index
                      ? `bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 font-semibold`
                      : `text-gray-900 dark:text-gray-300 hover:bg-gray-100 hover:dark:bg-gray-800`,
                  )}
                >
                  {title}
                </button>
              </li>
            ))}
          </ul>
        </aside>
      </Modal>
      {copyState.is === `copied` && <Status>Content markdown copied</Status>}
    </>
  );
};

export { ChaptersModal };
