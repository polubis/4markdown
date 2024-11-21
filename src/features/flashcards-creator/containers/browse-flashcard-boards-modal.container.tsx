import { Button } from 'design-system/button';
import Modal from 'design-system/modal';
import React from 'react';
import { BiLowVision, BiRefresh, BiShow, BiWorld, BiX } from 'react-icons/bi';
import c from 'classnames';
import { differenceInDays, formatDistance } from 'date-fns';
import { Tabs } from 'design-system/tabs';
import { useFlashcardsCreatorStore } from 'store/flashcards-creator/flashcards-creator.store';
import { selectFlashcardBoards } from 'store/flashcards-creator/flashcards-creator.selectors';
import type { FlashcardsBoardDto } from 'api-4markdown-contracts';

const rangeFilters = [`Recent`, `Old`, `Really Old`] as const;

type RangeFilter = (typeof rangeFilters)[number];

const rangeLookup: Record<RangeFilter, [number, number]> = {
  Recent: [0, 7],
  Old: [8, 30],
  'Really Old': [31, Number.MAX_VALUE],
};

const FilterableBoards = () => {
  const [activeRange, setActiveRange] = React.useState<RangeFilter>(
    rangeFilters[0],
  );

  const { activeFlashcardsBoardId, activateFlashcardsBoard } =
    useFlashcardsCreatorStore();
  const flashcardBoards = useFlashcardsCreatorStore(selectFlashcardBoards);

  const filteredFlashcardBoards = React.useMemo((): FlashcardsBoardDto[] => {
    const now = new Date();

    return flashcardBoards.filter((board) => {
      const diff = differenceInDays(now, board.mdate);
      const [from, to] = rangeLookup[activeRange];

      return diff >= from && diff <= to;
    });
  }, [flashcardBoards, activeRange]);

  return (
    <>
      <Tabs className="mb-5">
        {rangeFilters.map((range) => (
          <Tabs.Item
            key={range}
            title={`${range} documents`}
            active={range === activeRange}
            onClick={() => setActiveRange(range)}
          >
            {range}
          </Tabs.Item>
        ))}
      </Tabs>
      {filteredFlashcardBoards.length > 0 ? (
        <ul className="flex flex-col space-y-3">
          {filteredFlashcardBoards.map((flashcardsBoard) => (
            <li
              className={c(
                `flex flex-col cursor-pointer border-2 rounded-lg px-4 py-3`,
                activeFlashcardsBoardId === flashcardsBoard.id
                  ? `bg-green-700 text-white border-green-700 [&_p]:text-white`
                  : `bg-zinc-200 dark:hover:bg-gray-900 dark:bg-gray-950 hover:bg-zinc-300 border-zinc-300 dark:border-zinc-800`,
              )}
              title={flashcardsBoard.name}
              key={flashcardsBoard.id}
              onClick={() => activateFlashcardsBoard(flashcardsBoard.id)}
            >
              <div className="flex justify-between mb-0.5">
                <span className="text-sm capitalize">
                  Edited{` `}
                  {formatDistance(new Date(), flashcardsBoard.mdate, {
                    addSuffix: true,
                  })}
                  {` `}
                  ago
                </span>
                {flashcardsBoard.visibility === `private` && (
                  <BiLowVision
                    size="20"
                    title="This flashcards board is private"
                  />
                )}
                {flashcardsBoard.visibility === `public` && (
                  <BiShow size="20" title="This flashcards board is public" />
                )}
                {flashcardsBoard.visibility === `permanent` && (
                  <BiWorld
                    size="20"
                    title="This flashcards board is permanent"
                  />
                )}
              </div>
              <strong className="text-md">{flashcardsBoard.name}</strong>
              {flashcardsBoard.description && (
                <p className="text-sm mt-1">{flashcardsBoard.description}</p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <h6 className="p-4 text-center">
          No flashcard boards for selected filters
        </h6>
      )}
    </>
  );
};

const BrowseFlashcardBoardsModalContainer = () => {
  const { hideFlashcardBoards, flashcardBoards } = useFlashcardsCreatorStore();

  const pending =
    flashcardBoards.is === `idle` || flashcardBoards.is === `busy`;

  return (
    <Modal onEscape={pending ? undefined : hideFlashcardBoards}>
      <div className="flex items-center justify-between gap-4 mb-6">
        <h6 className="text-xl">Your Flashcard Boards</h6>
        <div className="flex gap-2">
          <Button
            type="button"
            i={2}
            s={1}
            title="Sync flashcard boards documents"
            disabled={pending}
          >
            <BiRefresh />
          </Button>
          <Button
            type="button"
            i={2}
            s={1}
            disabled={pending}
            title="Close your flashcard boards"
            onClick={hideFlashcardBoards}
          >
            <BiX />
          </Button>
        </div>
      </div>
      {pending && <p className="text-2xl">Just a second (￣▽￣)...</p>}
      {flashcardBoards.is === `fail` && (
        <p className="text-xl text-red-600 dark:text-red-400 text-center">
          Something went wrong... Try again with <strong>above button</strong>
        </p>
      )}
      {flashcardBoards.is === `ok` && <FilterableBoards />}
    </Modal>
  );
};

export { BrowseFlashcardBoardsModalContainer };
