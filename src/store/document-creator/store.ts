import { create } from 'zustand';
import type { DocumentCreator } from './models';
import { initCode } from './core';

const useDocumentCreatorStore = create<DocumentCreator.Store>(() => ({
  // State
  code: initCode(),
  changed: false,
  display: `both`,
  // Actions
}));

export { useDocumentCreatorStore };
