import type { Date, Description, Id, Name } from '../atoms';
import type { FlashcardDto } from './flashcard.dto';

type Base = {
  id: Id;
  mdate: Date;
  cdate: Date;
  name: Name;
  flashcards: FlashcardDto[];
};

type PrivateFlashcardsBoardDto = Base & {
  visibility: `private`;
  description: Description | null;
};

type PublicFlashcardsBoardDto = Base & {
  visibility: `public`;
  description: Description | null;
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
