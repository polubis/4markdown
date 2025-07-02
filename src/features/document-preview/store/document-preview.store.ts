import { create } from "zustand";
import type { DocumentPreviewStoreState } from "./document-preview.models";

const useDocumentPreviewStore = create<DocumentPreviewStoreState>(() => ({
	is: `idle`,
}));

export { useDocumentPreviewStore };
