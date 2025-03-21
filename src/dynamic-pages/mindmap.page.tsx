import React from 'react';
import { type HeadFC } from 'gatsby';
import Meta from 'components/meta';
import LogoThumbnail from 'images/logo-thumbnail.png';
import { meta } from '../../meta';
import type { MindmapPageModel } from 'models/page-models';
import { ScreenLoader } from 'design-system/screen-loader';
import { useMindmapPreviewState } from 'store/mindmap-preview';

interface MindmapPageProps {
  pageContext: MindmapPageModel;
}

const MindmapDisplayView = React.lazy(() =>
  import(`../features/mindmap-display/mindmap-display.view`).then((m) => ({
    default: m.MindmapDisplayView,
  })),
);

const MindmapPage = ({ pageContext }: MindmapPageProps) => {
  const { mindmap } = useMindmapPreviewState();

  if (mindmap.is === `idle`) {
    useMindmapPreviewState.swap({
      ...useMindmapPreviewState.getInitial(),
      mindmap: {
        is: `ok`,
        ...pageContext.mindmap,
      },
    });
  }

  return (
    <React.Suspense fallback={<ScreenLoader />}>
      <MindmapDisplayView />
    </React.Suspense>
  );
};

export default MindmapPage;

export const Head: HeadFC<unknown, MindmapPageModel> = ({ pageContext }) => {
  return (
    <Meta
      appName={meta.appName}
      title={pageContext.mindmap.name}
      description={pageContext.mindmap.description ?? pageContext.mindmap.name}
      url={`${meta.siteUrl}${pageContext.mindmap.path}`}
      keywords={[meta.appName, ...(pageContext.mindmap.tags ?? [])].join(`, `)}
      lang={meta.lang}
      image={meta.siteUrl + LogoThumbnail}
    />
  );
};
