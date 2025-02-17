import React from 'react';
import type { HeadFC } from 'gatsby';
import LogoThumbnail from 'images/logo-thumbnail.png';
import Meta from 'components/meta';
import { MindmapCreatorView } from 'features/mindmap-creator/mindmap-creator.view';
import { meta } from '../../meta';

const MindmapCreatorPage = () => {
  return <MindmapCreatorView />;
};

export default MindmapCreatorPage;

export const Head: HeadFC = () => {
  return (
    <Meta
      appName={meta.appName}
      title="Create Beautiful Mindmaps and Roadmaps with a Powerful Editor"
      description={`Visualize your learning journey, track progress, and stay organized with the ${meta.appName} mindmap and roadmap builder—your ultimate knowledge tool`}
      url={meta.siteUrl + meta.routes.mindmaps.creator}
      lang={meta.lang}
      image={meta.siteUrl + LogoThumbnail}
    />
  );
};
