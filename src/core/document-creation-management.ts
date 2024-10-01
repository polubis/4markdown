const key = `addRequested`;

const triggerDocumentCreation = (): void => {
  localStorage.setItem(key, `1`);
};

const resetDocumentCreation = (): void => {
  localStorage.removeItem(key);
};

const checkIsDocumentCreationActive = (): string | null =>
  localStorage.getItem(key);

export {
  triggerDocumentCreation,
  resetDocumentCreation,
  checkIsDocumentCreationActive,
};
