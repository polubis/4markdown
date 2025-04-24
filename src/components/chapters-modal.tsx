import { Button } from 'design-system/button';
import { Modal } from 'design-system/modal';
import React, { type ReactNode } from 'react';
import {
  BiArrowToLeft,
  BiArrowToRight,
  BiCheck,
  BiCopyAlt,
} from 'react-icons/bi';
import { Markdown } from './markdown';
import { useKeyPress } from 'development-kit/use-key-press';
import { falsy } from 'development-kit/guards';
import { useCopy } from 'development-kit/use-copy';
import { Status } from 'design-system/status';

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
  const [activeSectionIndex, setActiveSectionIndex] = React.useState(0);
  const [copyState, copy] = useCopy();

  const chapters = React.useMemo(() => {
    const parts = children.split(`\n`);
    const headingPositions: number[] = [];

    let introEnd = parts.length;

    for (let i = 0; i < parts.length; i++) {
      if (/^##\s.+$/.test(parts[i])) {
        headingPositions.push(i);

        if (introEnd === parts.length) {
          introEnd = i;
        }
      }
    }

    const intro = parts.slice(0, introEnd).join(`\n`).trim();

    const rest = headingPositions.map((start, index) => {
      const end = headingPositions[index + 1] ?? parts.length;
      return parts.slice(start, end).join(`\n`).trim();
    });

    return [intro, ...rest];
  }, [children]);

  const content = chapters[activeSectionIndex];

  const goToPreviousSection = (): void => {
    if (!isAbleToPrev(activeSectionIndex)) return;

    setActiveSectionIndex((prevIndex) => prevIndex - 1);
  };

  const goToNextSection = (): void => {
    if (!isAbleToNext(activeSectionIndex, chapters.length)) return;

    setActiveSectionIndex(activeSectionIndex + 1);
  };

  const copyActiveChapter = (): void => {
    copy(content);
  };

  useKeyPress([`a`, `A`], goToPreviousSection);
  useKeyPress([`d`, `D`], goToNextSection);

  React.useLayoutEffect(() => {
    const modal = document.getElementById(modalId);

    falsy(modal, `Cannot find ${modalId}`);

    modal.scrollTo({ top: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSectionIndex]);

  const ableToPrev = isAbleToPrev(activeSectionIndex);
  const ableToNext = isAbleToNext(activeSectionIndex, chapters.length);

  return (
    <>
      <Modal
        id={modalId}
        className="[&>*]:w-[100%] [&>*]:max-w-3xl [&>*]:p-0 md:[&>*]:rounded-lg [&>*]:rounded-none md:!p-4 !p-0"
        onClose={onClose}
      >
        <Modal.Header
          className="p-4 border-b border-zinc-300 dark:border-zinc-800 !mb-0"
          title={`Chapter (${activeSectionIndex + 1}/${chapters.length})`}
          closeButtonTitle="Close display as a book mode (Esc)"
        >
          {controls}
        </Modal.Header>
        <Markdown className="p-4 !max-w-full">{content}</Markdown>
        <footer className="flex items-center justify-end p-4 gap-2 py-3 border-t border-zinc-300 dark:border-zinc-800">
          <Button
            i={2}
            s={1}
            title="Copy this chapter markdown (C)"
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
      </Modal>
      {copyState.is === `copied` && <Status>Chapter markdown copied</Status>}
    </>
  );
};

export { ChaptersModal };
