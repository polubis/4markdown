const key = `add-document`;

const isDocumentCreationActive = (): boolean =>
  localStorage.getItem(key) === `1`;

const triggerDocumentCreation = (): void => {
  localStorage.setItem(key, `1`);
};

const resetDocumentCreation = (): void => {
  localStorage.removeItem(key);
};

export {
  isDocumentCreationActive,
  triggerDocumentCreation,
  resetDocumentCreation,
};
