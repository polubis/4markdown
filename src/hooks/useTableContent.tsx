import React, { type ReactNode } from 'react';
import debounce from 'lodash.debounce';

export type Heading = {
  id: string;
  text: string;
  level: number;
  items: Heading[];
};

type UseTableContentsOptions = {
  content: string;
  isOpen?: boolean;
};

export const extractTextFromNode = (node: ReactNode): string => {
  if (typeof node === `string`) return node;
  if (typeof node === `number`) return String(node);
  if (node === null || node === undefined) return ``;

  if (React.isValidElement(node)) {
    const childrenText = React.Children.toArray(node.props.children)
      .map(extractTextFromNode)
      .join(``);
    return childrenText;
  }

  if (Array.isArray(node)) {
    return node.map(extractTextFromNode).join(``);
  }

  return String(node);
};

export const cleanText = (text: string): string => {
  return text.replace(/(\*\*|\*|`|#)/g, ``);
};

export const generateId = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/(\*\*|\*|`|#|\s+|-+|[^a-z0-9-]|^-+|-+$)/g, (match) => {
      if (match.match(/\s+|-+/)) return `-`;
      return ``;
    });
};

type TraverseAccumulator<T> = (results: T[]) => T[];

export const traverseHeadings = <T,>(
  headings: Heading[],
  mapper: (heading: Heading) => T,
  accumulator: TraverseAccumulator<T> = (results) => results,
): T[] => {
  const traverse = (items: Heading[]): T[] => {
    const results: T[] = [];
    for (const heading of items) {
      results.push(mapper(heading));
      if (heading.items.length > 0) {
        results.push(...traverse(heading.items));
      }
    }
    return accumulator(results);
  };
  return traverse(headings);
};

export const extractHeadingsFromContent = (content: string): Heading[] => {
  if (!content) return [];

  const parseHeading = (line: string): Heading | null => {
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (!match) return null;
    const [, hashes, text] = match;
    return {
      id: generateId(text),
      text: cleanText(text),
      level: hashes.length,
      items: [],
    };
  };

  return content
    .split(`\n`)
    .map(parseHeading)
    .filter((heading): heading is Heading => heading !== null);
};

export const useTableContent = ({ content }: UseTableContentsOptions) => {
  const [activeHeadingId, setActiveHeadingId] = React.useState<string>(``);
  const isScrollingRef = React.useRef(false);
  const scrollTimeoutRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (typeof window !== `undefined` && window.location.hash) {
      window.history.replaceState(
        null,
        ``,
        `${window.location.pathname}${window.location.search}`,
      );
    }
  }, []);

  const headings = React.useMemo(() => {
    const allHeadings = extractHeadingsFromContent(content);
    const result: Heading[] = [];
    const stack: Heading[] = [];

    for (const heading of allHeadings) {
      while (
        stack.length > 0 &&
        stack[stack.length - 1].level >= heading.level
      ) {
        stack.pop();
      }

      if (stack.length === 0) {
        result.push(heading);
      } else {
        stack[stack.length - 1].items.push(heading);
      }

      stack.push(heading);
    }

    return result;
  }, [content]);

  const extractAllHeadingIds = React.useCallback(
    (headingItems: Heading[]): string[] => {
      return traverseHeadings(headingItems, (heading) => heading.id);
    },
    [],
  );

  React.useEffect(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = null;
    }

    if (!headings.length) return;

    const observerOptions = {
      rootMargin: `-20px 0px -80% 0px`,
      threshold: [0, 0.5, 1],
    };

    const debouncedSetActiveHeading = debounce((id: string) => {
      if (isScrollingRef.current) return;

      setActiveHeadingId(id);

      if (window.location.hash !== `#${id}` && typeof window !== `undefined`) {
        window.history.replaceState(
          null,
          ``,
          `${window.location.pathname}${window.location.search}#${id}`,
        );
      }
    }, 200);

    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      if (isScrollingRef.current) return;

      const visibleEntries = entries.filter((entry) => entry.isIntersecting);

      if (visibleEntries.length > 0) {
        const topHeading = visibleEntries[0];
        const id = topHeading.target.id;

        if (id) {
          debouncedSetActiveHeading(id);
        }
      }
    };

    const observer = new IntersectionObserver(handleObserver, observerOptions);

    const allHeadingIds = extractAllHeadingIds(headings);

    allHeadingIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      debouncedSetActiveHeading.cancel();
      observer.disconnect();

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = null;
      }
    };
  }, [headings, extractAllHeadingIds]);

  const handleHeadingClick = React.useCallback(
    (e: React.MouseEvent, id: string) => {
      e.preventDefault();

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = null;
      }

      setActiveHeadingId(id);
      isScrollingRef.current = true;

      const element = document.getElementById(id);
      if (element) {
        if (typeof window !== `undefined`) {
          window.history.pushState(
            null,
            ``,
            `${window.location.pathname}${window.location.search}#${id}`,
          );
        }

        element.scrollIntoView({ behavior: `smooth` });

        scrollTimeoutRef.current = window.setTimeout(() => {
          isScrollingRef.current = false;
        }, 1000);
      }
    },
    [],
  );

  return {
    content,
    headings,
    handleHeadingClick,
    activeHeadingId,
  };
};
