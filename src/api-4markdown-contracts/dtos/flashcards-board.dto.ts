import type { Description, Id, Name } from '../atoms';
import type { FlashcardDto } from './flashcard.dto';

type Base = {
  id: Id;
  name: Name;
  flashcards: FlashcardDto[];
};

type PrivateFlashcardsBoardDto = Base & {
  visibility: `private`;
};

type PublicFlashcardsBoardDto = Base & {
  visibility: `public`;
};

type PermanentFlashcardsBoardDto = Base & {
  visibility: `permanent`;
  description: Description;
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
