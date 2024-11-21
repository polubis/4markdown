import type { Date, Description, Id, Name } from '../atoms';
import type { FlashcardDto } from './flashcard.dto';

type Base = {
  id: Id;
  mdate: Date;
  cdate: Date;
  name: Name;
  flashcards: FlashcardDto[];
  tags: [string, ...string[]];
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
  displayOnEducationZone: boolean;
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
