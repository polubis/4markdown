import { create } from 'zustand';
import type { DocumentsCreatorState } from './models';
import { createInitialCode } from '../../../create-initial-code';

const useDocumentsCreatorState = create<DocumentsCreatorState>(() => ({
  documents: [],
  activeDocumentId: null,
  initialCode: createInitialCode(),
  code: ``,
  changed: false,
  display: `both`,
  busy: false,
  error: null,
}));

export { useDocumentsCreatorState };
