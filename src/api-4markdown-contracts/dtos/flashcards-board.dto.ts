import type { Id, Name, Order } from '../atoms';
import type { FlashcardDto } from './flashcard.dto';

type Base = {
  id: Id;
  name: Name;
  flashcards: Record<Order, FlashcardDto>;
};

type PrivateFlashcardsBoardDto = Base & {
  visibility: `private`;
};

type PublicFlashcardsBoardDto = Base & {
  visibility: `public`;
};

type PermanentFlashcardsBoardDto = Base & {
  visibility: `permanent`;
};

type FlashcardsBoardDto =
  | PrivateFlashcardsBoardDto
  | PublicFlashcardsBoardDto
  | PermanentFlashcardsBoardDto;

export type {
  FlashcardsBoardDto,
  PrivateFlashcardsBoardDto,
  PublicFlashcardsBoardDto,
  PermanentFlashcardsBoardDto,
};
