import React, { type ReactNode } from 'react';
import { Bar } from 'design-system/bar';
import { Button } from 'design-system/button';
import { useAuthStore } from 'store/auth/auth.store';
import { BarLoadingPlaceholder } from 'components/bar-loading-placeholder';
import { useFlashcardsCreatorStore } from 'store/flashcards-creator/flashcards-creator.store';
import { BiDotsHorizontal, BiGridAlt } from 'react-icons/bi';
import type { FlashcardsBoardDto } from 'api-4markdown-contracts';
import { useToggle } from 'development-kit/use-toggle';
import { FlashcardsBoardDetailsModalContainer } from './flashcards-board-details-modal.container';

const DEFAULT_TITLE = `Flashcards Board`;

const Title = ({ children }: { children: ReactNode }) => (
  <h6 className="text-lg font-bold">{children}</h6>
);

const BarContent = () => {
  const { activeFlashcardsBoardId, flashcardBoards, showFlashcardBoards } =
    useFlashcardsCreatorStore();
  const flashcardsBoardDetailsModal = useToggle();

  const activeFlashcardsBoard = React.useMemo((): FlashcardsBoardDto | null => {
    if (activeFlashcardsBoardId === null) return null;

    if (
      flashcardBoards.is === `fail` ||
      flashcardBoards.is === `busy` ||
      flashcardBoards.is === `idle`
    )
      return null;

    return (
      flashcardBoards.data.find(
        (flashcardsBoard) => flashcardsBoard.id === activeFlashcardsBoardId,
      ) ?? null
    );
  }, [activeFlashcardsBoardId, flashcardBoards]);

  return (
    <>
      <Title>
        {activeFlashcardsBoard ? activeFlashcardsBoard.name : DEFAULT_TITLE}
      </Title>
      <Button
        i={1}
        s={1}
        className="ml-2"
        disabled={
          flashcardBoards.is === `idle` || flashcardBoards.is === `busy`
        }
        title="Your flashcard boards"
        onClick={showFlashcardBoards}
      >
        <BiGridAlt />
      </Button>
      {activeFlashcardsBoard && (
        <>
          <Button
            i={1}
            s={1}
            disabled={
              flashcardBoards.is === `idle` || flashcardBoards.is === `busy`
            }
            title="Show flashcards board details"
            onClick={flashcardsBoardDetailsModal.open}
          >
            <BiDotsHorizontal />
          </Button>
          {flashcardsBoardDetailsModal.opened && (
            <FlashcardsBoardDetailsModalContainer />
          )}
        </>
      )}
    </>
  );
};

const FlashcardsBoardMaintenanceBarContainer = () => {
  const authStore = useAuthStore();

  return (
    <Bar className="h-[50px] items-center gap-2">
      {authStore.is === `idle` && <BarLoadingPlaceholder />}
      {authStore.is === `authorized` && <BarContent />}
      {authStore.is === `unauthorized` && <Title>{DEFAULT_TITLE}</Title>}
    </Bar>
  );
};

export { FlashcardsBoardMaintenanceBarContainer };
