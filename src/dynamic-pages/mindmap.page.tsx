import React from "react";
import { type HeadFC } from "gatsby";
import Meta from "components/meta";
import LogoThumbnail from "images/logo-thumbnail.png";
import { meta } from "../../meta";
import type { MindmapPageModel } from "models/page-models";
import type {
  AccessibleMindmapDto,
  AccessibleMindmapNode,
} from "api-4markdown-contracts";
import { useMindmapPreviewState } from "store/mindmap-preview";
import { MindmapDisplayView } from "features/mindmap-display/mindmap-display.view";

interface MindmapPageProps {
  pageContext: MindmapPageModel;
}

const toAccessibleMindmapNode = (
  node: MindmapPageModel["mindmap"]["nodes"][number],
): AccessibleMindmapNode => ({
  ...node,
  ugly: 0,
  bad: 0,
  decent: 0,
  good: 0,
  perfect: 0,
  scoreAverage: 0,
  scoreCount: 0,
  scoreValues: [],
});

const useMindmapPageHydration = ({ pageContext }: MindmapPageProps) => {
  const hydrated = React.useRef(false);

  if (!hydrated.current) {
    const mindmap: AccessibleMindmapDto = {
      ...pageContext.mindmap,
      nodes: pageContext.mindmap.nodes.map(toAccessibleMindmapNode),
    };

    useMindmapPreviewState.swap({
      ...useMindmapPreviewState.getInitial(),
      mindmap: {
        is: `ok`,
        ...mindmap,
      },
    });

    hydrated.current = true;
  }
};

const MindmapPage = (props: MindmapPageProps) => {
  useMindmapPageHydration(props);

  return <MindmapDisplayView />;
};

export default MindmapPage;

export const Head: HeadFC<unknown, MindmapPageModel> = ({ pageContext }) => {
  return (
    <Meta
      appName={meta.appName}
      title={pageContext.mindmap.name}
      description={pageContext.mindmap.description ?? pageContext.mindmap.name}
      url={`${meta.siteUrl}${pageContext.mindmapPath}`}
      keywords={[meta.appName, ...(pageContext.mindmap.tags ?? [])].join(`, `)}
      lang={meta.lang}
      image={meta.siteUrl + LogoThumbnail}
    />
  );
};
