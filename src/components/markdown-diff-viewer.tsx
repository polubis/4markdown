import React from "react";
import type { MarkdownDiffViewerProps } from "components/markdown-diff-viewer-content";

const MarkdownDiffViewerContentLazy = React.lazy(async () => {
  const mod = await import("components/markdown-diff-viewer-content");
  return { default: mod.MarkdownDiffViewerContent };
});

const MarkdownDiffViewer = (props: MarkdownDiffViewerProps) => {
  return (
    <React.Suspense>
      <MarkdownDiffViewerContentLazy {...props} />
    </React.Suspense>
  );
};

export { MarkdownDiffViewer };
export type { MarkdownDiffViewerProps } from "components/markdown-diff-viewer-content";
