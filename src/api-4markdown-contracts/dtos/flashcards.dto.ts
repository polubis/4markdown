type FlashcardOrder = number;

type FlashcardDto = {
  id: string;
  content: string;
};

type FlashcardsDto = {
  id: string;
  name: string;
  description?: string;
  items: Record<FlashcardOrder, FlashcardDto>;
};

export { FlashcardsDto, FlashcardDto };
