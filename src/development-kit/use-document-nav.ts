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


  useEffect(() => {
    setDocumentNavState((prevState) => ({
      ...prevState,
      totalDocs: docsState().docs.length,
    }));
  }, [docsState().docs.length]);


  const updateCurrentDocIndex = (updateFunction: (currentIndex: number, totalDocs: number) => number) => {
    setDocumentNavState((prevState) => {
      const newCurrentIndex = updateFunction(prevState.currentDocIndex, prevState.totalDocs);
      return { ...prevState, currentDocIndex: newCurrentIndex };
    });
  };

  const documentNavActions: DocumentNavActions = {
    navigateNext: () => updateCurrentDocIndex((currentIndex, totalDocs) => (currentIndex + 1) % totalDocs),
    navigatePrevious: () => updateCurrentDocIndex((currentIndex, totalDocs) => (currentIndex - 1 + totalDocs) % totalDocs),
  };

  useEffect(() => {
    const activeDoc = docsState().docs[documentNavState.currentDocIndex];
    if (activeDoc) {
      docStoreActions.setActive(activeDoc);
    }
  }, [documentNavState.currentDocIndex, docsState]);

  const touchStartX = useRef<number | null>(null);

  const prevButtonDisabled = documentNavState.currentDocIndex === 0;
  const nextButtonDisabled =
    documentNavState.currentDocIndex === documentNavState.totalDocs - 1;

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: TouchEvent) => {
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

  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchEnd]);

  return {
    ...documentNavState,
    ...documentNavActions,
  };
};

export { useDocumentNav };