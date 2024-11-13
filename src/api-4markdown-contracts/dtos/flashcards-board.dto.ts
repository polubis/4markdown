import type { Id, Name } from '../atoms';

type Base = {
  id: Id;
  name: Name;
};

type PrivateFlashcardsBoardDto = Base & {
  visibility: `private`;
};

type PublicFlashcardsBoardDto = Base & {
  visibility: `public`;
};

type FlashcardsBoardDto = PrivateFlashcardsBoardDto | PublicFlashcardsBoardDto;

export { FlashcardsBoardDto };
