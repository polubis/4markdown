import type { API4MarkdownDto, Atoms } from "api-4markdown-contracts";

type MockDocument = Extract<
  API4MarkdownDto<"getYourDocuments">[number],
  { visibility: "private" }
>;

const documentNames = [
  `Introduction to TypeScript`,
  `React Performance Tips`,
  `Understanding Zustand`,
  `CSS Grid Complete Guide`,
  `Node.js Best Practices`,
  `GraphQL vs REST API`,
  `Docker for Developers`,
  `Git Workflow Strategies`,
  `Testing React Components`,
  `Web Accessibility Guide`,
];

const generateMockDocument = (index: number): MockDocument => {
  const now = Date.now();
  const daysAgo = index * 3;
  const nameBase = documentNames[index % documentNames.length];
  const nameSuffix =
    index >= documentNames.length
      ? ` ${Math.floor(index / documentNames.length) + 1}`
      : ``;

  return {
    id: `mock-doc-${index + 1}` as Atoms[`DocumentId`],
    name: `${nameBase}${nameSuffix}`,
    code: `# ${nameBase}\n\nSample content for document ${index + 1}.`,
    visibility: `private`,
    commentsCount: 0,
    mdate: new Date(now - daysAgo * 86400000).toISOString() as Atoms[`UTCDate`],
    cdate: new Date(
      now - (daysAgo + 5) * 86400000,
    ).toISOString() as Atoms[`UTCDate`],
    path: `/mock-doc-${index + 1}` as Atoms[`Path`],
    score: { average: 0, count: 0, values: [] },
  };
};

const generateMockDocuments = (
  count: number,
  startIndex: number = 0,
): API4MarkdownDto<`getYourDocuments`> =>
  Array.from({ length: count }, (_, i) => generateMockDocument(startIndex + i));

export { generateMockDocuments };
