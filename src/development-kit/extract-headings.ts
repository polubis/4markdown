import { unified } from 'unified';
import remarkParse from 'remark-parse';
import { visit } from 'unist-util-visit';
import { toString } from 'mdast-util-to-string';
import type { Heading } from 'mdast';

type ExtractedHeading = {
  level: number;
  text: string;
};

const extractHeadings = (markdown: string): ExtractedHeading[] => {
  const tree = unified().use(remarkParse).parse(markdown);

  const headings: ExtractedHeading[] = [];

  visit(tree, `heading`, (node: Heading) => {
    const level = node.depth;
    const text = toString(node);
    headings.push({ level, text });
  });

  return headings;
};

export type { ExtractedHeading };
export { extractHeadings };
