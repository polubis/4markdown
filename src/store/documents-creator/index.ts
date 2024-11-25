import { create } from 'zustand';
import type { DocumentsCreatorState } from './models';

const useDocumentsCreatorState = create<DocumentsCreatorState>(() => ({
  documents: [],
  activeDocumentId: null,
  initialCode: ``,
  code: ``,
  changed: false,
  display: `both`,
  busy: false,
  error: null,
}));

export { useDocumentsCreatorState };
