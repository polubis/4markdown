import React from 'react';
import type { HeadFC } from 'gatsby';
import Meta from 'components/meta';
import LogoThumbnail from 'images/logo-thumbnail.png';
import { meta } from '../../meta';
import { ScreenLoader } from 'design-system/screen-loader';

const MindmapPreviewView = React.lazy(() =>
  import(`../features/mindmap-preview/mindmap-preview.view`).then((m) => ({
    default: m.MindmapPreviewView,
  })),
);

const MindmapPreviewPage = () => {
  return (
    <React.Suspense fallback={<ScreenLoader />}>
      <MindmapPreviewView />
    </React.Suspense>
  );
};

export default MindmapPreviewPage;

export const Head: HeadFC = () => {
  return (
    <Meta
      appName={meta.appName}
      title={meta.title}
      description={meta.description}
      url={meta.siteUrl + meta.routes.mindmaps.preview}
      lang={meta.lang}
      image={meta.siteUrl + LogoThumbnail}
      robots="noindex, nofollow"
    />
  );
};
