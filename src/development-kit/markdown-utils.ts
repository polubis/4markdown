import { unified } from 'unified';
import remarkParse from 'remark-parse';
import { toString } from 'mdast-util-to-string';

type HeadingItem = {
  level: number;
  text: string;
  hash: string;
};

const getPlainText = (markdown: string): string => {
  const tree = unified().use(remarkParse).parse(markdown);

  return toString(tree);
};

const extractHeadings = (markdown: string): HeadingItem[] => {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;

  return (markdown.match(headingRegex) ?? []).map((heading) => {
    const [, hashes, text] = heading.match(/^(#{1,6})\s+(.+)$/) ?? [];
    const parsedText = getPlainText(text);
    const hash = parsedText.replace(/\s+/g, `-`);

    return {
      level: hashes.length,
      hash,
      text: parsedText,
    };
  });
};

export type { HeadingItem };
export { extractHeadings };
