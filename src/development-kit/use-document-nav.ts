import React, { useState, useEffect, useRef } from 'react';
import { docStoreActions } from 'store/doc/doc.store';
import { docsStoreSelectors } from '../store/docs/docs.store';


interface DocumentNavState {
  currentDocIndex: number;
  totalDocs: number;
}

interface DocumentNavActions {
  navigateNext: () => void;
  navigatePrevious: () => void;
}

const useDocumentNav = () => {
  const { ok: docsState } = docsStoreSelectors;

  const [documentNavState, setDocumentNavState] = useState<DocumentNavState>({
    currentDocIndex: 0,
    totalDocs: docsState().docs.length,
  });

  const documentNavActions: DocumentNavActions = {
    navigateNext: () => {
      setDocumentNavState((prevState) => ({
        ...prevState,
        currentDocIndex: (prevState.currentDocIndex + 1) % prevState.totalDocs,
      }));
    },
    navigatePrevious: () => {
      setDocumentNavState((prevState) => ({
        ...prevState,
        currentDocIndex:
          (prevState.currentDocIndex - 1 + prevState.totalDocs) %
          prevState.totalDocs,
      }));
    },
  };

  useEffect(() => {
    const activeDoc = docsState().docs[documentNavState.currentDocIndex];
    if (activeDoc) {
      docStoreActions.setActive(activeDoc);
    }
  }, [documentNavState.currentDocIndex, docsState]);

  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current !== null) {
      const touchEndX = e.changedTouches[0].clientX;
      const deltaX = touchEndX - touchStartX.current;

      if (deltaX > 0 && !prevButtonDisabled) {
        // Swipe to the right
        documentNavActions.navigatePrevious();
      } else if (deltaX < 0 && !nextButtonDisabled) {
        // Swipe to the left
        documentNavActions.navigateNext();
      }

      touchStartX.current = null;
    }
  };

  const prevButtonDisabled = documentNavState.currentDocIndex === 0;
  const nextButtonDisabled =
    documentNavState.currentDocIndex === documentNavState.totalDocs - 1;

  useEffect(() => {
    document.addEventListener(
      `touchstart`,
      handleTouchStart as unknown as EventListener,
    );
    document.addEventListener(
      `touchend`,
      handleTouchEnd as unknown as EventListener,
    );

    return () => {
      document.removeEventListener(
        `touchstart`,
        handleTouchStart as unknown as EventListener,
      );
      document.removeEventListener(
        `touchend`,
        handleTouchEnd as unknown as EventListener,
      );
    };
  }, [handleTouchStart, handleTouchEnd]);

  return {
    ...documentNavState,
    ...documentNavActions,
  };
};

export { useDocumentNav };
