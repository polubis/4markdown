import { Button } from 'design-system/button';
import { Modal } from 'design-system/modal';
import React from 'react';
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

const modalId = `documents-chapters-modal`;

const isAbleToPrev = (activeSectionIndex: number): boolean =>
  activeSectionIndex > 0;

const isAbleToNext = (
  activeSectionIndex: number,
  sectionsLength: number,
): boolean => activeSectionIndex <= sectionsLength - 2;

const DocumentChaptersModal = ({
  children,
  onClose,
}: {
  children: string;
  onClose(): void;
}) => {
  const [activeSectionIndex, setActiveSectionIndex] = React.useState(0);
  const [copyState, copy] = useCopy();

  const chapters = React.useMemo(() => {
    const parts = children.split(`\n`);

    const intro = parts
      .slice(
        0,
        parts.findIndex((part) => /^##\s.+$/.test(part)),
      )
      .join(`\n`)
      .trim();

    const rest = parts
      .reduce<number[]>((acc, part, index) => {
        if (/^##\s.+$/.test(part)) {
          acc.push(index);
        }

        return acc;
      }, [])
      .map((start, index, positions) => {
        const end = positions[index + 1] ?? parts.length - 1;

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
  useKeyPress([`c`, `C`], copyActiveChapter);

  React.useLayoutEffect(() => {
    const modal = document.getElementById(modalId);

    falsy(modal, `Cannot find ${modalId}`);

    modal.scrollTo({ top: 0 });
  }, [activeSectionIndex]);

  return (
    <>
      <Modal
        id={modalId}
        className="[&>*]:w-[100%] [&>*]:max-w-3xl [&>*]:p-0 md:[&>*]:rounded-lg [&>*]:rounded-none md:!p-4 !p-0"
        onClose={onClose}
      >
        <Modal.Header
          className="p-4 border-b border-zinc-300 dark:border-zinc-800 !mb-0"
          title={`Chapter (${activeSectionIndex + 1})`}
          closeButtonTitle="Close display as a book mode (Esc)"
        />
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
          <div className="h-4 w-0.5 mx-1 bg-zinc-300 dark:bg-zinc-800" />
          {isAbleToPrev(activeSectionIndex) && (
            <Button
              i={2}
              s={1}
              title="Go to previous chapter (A)"
              onClick={goToPreviousSection}
            >
              <BiArrowToLeft />
            </Button>
          )}
          {isAbleToNext(activeSectionIndex, chapters.length) && (
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

export { DocumentChaptersModal };
