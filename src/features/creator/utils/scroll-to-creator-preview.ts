const JUMP = 25;

const scrollToCreatorPreview = (input: HTMLTextAreaElement): void => {
  const markdownElement = document.querySelector(`.markdown`);

  if (!markdownElement) return;

  const caretPosition = input.selectionStart;
  const textBeforeCursor = input.value.slice(0, caretPosition);
  const rowNumber = textBeforeCursor.split(`\n`).length - 1;

  markdownElement.scrollTop = rowNumber * JUMP;
};

export { scrollToCreatorPreview };
