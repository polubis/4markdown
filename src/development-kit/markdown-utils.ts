type HeadingItem = {
  level: number;
  text: string;
  id: string;
};

const extractHeadings = (markdown: string): HeadingItem[] => {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;

  return (markdown.match(headingRegex) ?? []).map((heading) => {
    const [, hashes, text] = heading.match(/^(#{1,6})\s+(.+)$/) ?? [];

    return {
      level: hashes.length,
      text: text.trim(),
      id: text
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, `-`),
    };
  });
};

export type { HeadingItem };
export { extractHeadings };
