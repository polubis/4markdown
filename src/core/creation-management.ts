const KEYS = {
	ADD_DOCUMENT: `add-document`,
};

const isDocumentCreationActive = (): boolean =>
	localStorage.getItem(KEYS.ADD_DOCUMENT) === `1`;

const triggerDocumentCreation = (): void => {
	localStorage.setItem(KEYS.ADD_DOCUMENT, `1`);
};

const resetDocumentCreation = (): void => {
	localStorage.removeItem(KEYS.ADD_DOCUMENT);
};

export {
	isDocumentCreationActive,
	triggerDocumentCreation,
	resetDocumentCreation,
};
