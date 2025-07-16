import { unified } from "unified";
import remarkParse from "remark-parse";
import { visit } from "unist-util-visit";
import { toString as toStringUtil } from "mdast-util-to-string";
import type { Heading } from "mdast";

type ExtractedHeading = {
  level: number;
  text: string;
};

const extractHeadings = (markdown: string): ExtractedHeading[] => {
  const tree = unified().use(remarkParse).parse(markdown);

  const headings: ExtractedHeading[] = [];

  visit(tree, `heading`, (node: Heading) => {
    const level = node.depth;
    const text = toStringUtil(node);
    headings.push({ level, text });
  });

  return headings;
};

export type { ExtractedHeading };
export { extractHeadings };
