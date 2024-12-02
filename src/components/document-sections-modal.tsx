import { Button } from 'design-system/button';
import { Modal } from 'design-system/modal';
import React from 'react';
import { BiArrowToLeft, BiArrowToRight, BiCodeAlt, BiX } from 'react-icons/bi';
import { Markdown } from './markdown';
import { useKeyPress } from 'development-kit/use-key-press';
import { ok } from 'development-kit/guards';

type DocumentSectionsModalProps = { children: string; onClose(): void };

const modalId = `documents-sections-modal`;

const isAbleToPrev = (activeSectionIndex: number): boolean =>
  activeSectionIndex > 0;

const isAbleToNext = (
  activeSectionIndex: number,
  sectionsLength: number,
): boolean => activeSectionIndex <= sectionsLength - 2;

const DocumentSectionsModal = ({
  children,
  onClose,
}: DocumentSectionsModalProps) => {
  const [activeSectionIndex, setActiveSectionIndex] = React.useState(0);

  const sections = React.useMemo(() => {
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

  const goToPreviousSection = (): void => {
    if (!isAbleToPrev(activeSectionIndex)) return;

    setActiveSectionIndex((prevIndex) => prevIndex - 1);
  };

  const goToNextSection = (): void => {
    if (!isAbleToNext(activeSectionIndex, sections.length)) return;

    setActiveSectionIndex(activeSectionIndex + 1);
  };

  useKeyPress([`a`, `A`], goToPreviousSection);
  useKeyPress([`d`, `D`], goToNextSection);

  React.useLayoutEffect(() => {
    const modal = document.getElementById(modalId);

    ok(modal, `Cannot find ${modalId}`);

    modal.scrollTo({ top: 0 });
  }, [activeSectionIndex]);

  const content = sections[activeSectionIndex];

  return (
    <Modal
      id={modalId}
      className="[&>*]:w-[100%] [&>*]:max-w-3xl [&>*]:p-0 md:[&>*]:rounded-lg [&>*]:rounded-none md:!p-4 !p-0"
      onEscape={onClose}
    >
      <header className="flex items-center p-4 border-b-2 border-zinc-300 dark:border-zinc-800">
        <h6 className="text-xl mr-8">
          ({activeSectionIndex + 1}) Section Preview
        </h6>
        <Button
          className="ml-auto"
          i={2}
          s={1}
          onClick={onClose}
          title="Close section preview (Esc)"
        >
          <BiX />
        </Button>
      </header>
      <section className="p-4">
        <Markdown>{content}</Markdown>
      </section>
      <footer className="flex items-center justify-end p-4 space-x-2 py-3 border-t-2 border-zinc-300 dark:border-zinc-800">
        <Button i={2} s={1} title="Copy this section markdown (C)">
          <BiCodeAlt />
        </Button>
        {isAbleToPrev(activeSectionIndex) && (
          <Button
            i={2}
            s={1}
            title="Go to previous section (A)"
            onClick={goToPreviousSection}
          >
            <BiArrowToLeft />
          </Button>
        )}
        {isAbleToNext(activeSectionIndex, sections.length) && (
          <Button
            i={2}
            s={1}
            title="Go to next section (D)"
            onClick={goToNextSection}
          >
            <BiArrowToRight />
          </Button>
        )}
      </footer>
    </Modal>
  );
};

export { DocumentSectionsModal };
