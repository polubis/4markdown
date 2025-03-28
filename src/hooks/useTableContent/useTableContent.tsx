import React, { type MouseEvent } from 'react';
import { generateHeadingId, generateHeadingTitle } from './utils';
import debounce from 'lodash.debounce';

type Heading = {
  id: string;
  text: string;
  level: number;
};

export const useTableContent = (content: string) => {
  const [activeHeadingId, setActiveHeadingId] = React.useState<string | null>(
    null,
  );
  const headingElementsRef = React.useRef<{
    [key: string]: IntersectionObserverEntry;
  }>({});

  // Lock updates from the observer for 1 second
  // When click on heading and click on another
  // the previous one is active for 500ms then the current one is active
  const lockTimeoutRef = React.useRef<number | null>(null);

  const getParsedHeadings = React.useMemo(() => {
    const lines = content.split(`\n`);
    const headings: Heading[] = [];

    lines.forEach((line) => {
      const match = line.match(/^(#{1,6})\s(.+)$/);
      if (match) {
        const level = match[1].length;
        const rawText = match[2].trim();

        headings.push({
          id: generateHeadingId(rawText),
          text: generateHeadingTitle(rawText),
          level,
        });
      }
    });

    return headings;
  }, [content]);

  const debouncedSetActiveHeading = React.useMemo(
    () =>
      debounce((id: string) => {
        if (!lockTimeoutRef.current) {
          setActiveHeadingId(id);
        }
      }, 500),
    [],
  );

  React.useEffect(() => {
    const callback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        headingElementsRef.current[entry.target.id] = entry;
      });

      const visibleHeadings = Object.values(headingElementsRef.current).filter(
        (entry) => entry.isIntersecting,
      );

      if (visibleHeadings.length > 0) {
        const sortedVisibleHeadings = visibleHeadings.sort(
          (a, b) =>
            Math.abs(a.boundingClientRect.top) -
            Math.abs(b.boundingClientRect.top),
        );

        debouncedSetActiveHeading(sortedVisibleHeadings[0].target.id);
      }
    };

    const observer = new IntersectionObserver(callback, {
      rootMargin: `0px 0px -80% 0px`,
    });

    getParsedHeadings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      getParsedHeadings.forEach(({ id }) => {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      });
      if (lockTimeoutRef.current) {
        window.clearTimeout(lockTimeoutRef.current);
      }
    };
  }, [getParsedHeadings, debouncedSetActiveHeading]);

  const handleScrollToSection = React.useCallback(
    (e: MouseEvent<HTMLAnchorElement>, id: string) => {
      e.preventDefault();
      const element = document.getElementById(id);
      if (element) {
        setActiveHeadingId(id);

        if (lockTimeoutRef.current) {
          window.clearTimeout(lockTimeoutRef.current);
        }
        lockTimeoutRef.current = window.setTimeout(() => {
          lockTimeoutRef.current = null;
        }, 1000);

        element.scrollIntoView({ behavior: `smooth` });
      }
    },
    [],
  );

  const setActiveHeading = React.useCallback((id: string | null) => {
    setActiveHeadingId(id);
  }, []);

  return {
    getParsedHeadings,
    handleScrollToSection,
    activeHeadingId,
    setActiveHeading,
  };
};
