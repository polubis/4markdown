import React from 'react';
import Meta from 'components/meta';
import LogoThumbnail from 'images/logo-thumbnail.png';
import { meta } from '../../meta';
import { MindmapCreatorView } from 'features/mindmap-creator/mindmap-creator.view';

const MindmapCreatorPage = () => {
  return <MindmapCreatorView />;
};

export default MindmapCreatorPage;

export const Head = () => {
  return (
    <Meta
      appName={meta.appName}
      title={`Build and Preview Mindmaps | ${meta.appName}`}
      description={`Explore ${meta.appName}'s powerful mindmap creator. Build, customize, and preview your mindmaps effortlessly. Use this app to visually organize your ideas and collaborate with others in real-time`}
      url={meta.siteUrl + meta.routes.mindmap.creator}
      lang={meta.lang}
      keywords={`Mindmap builder, ${meta.appName}, Mindmap creator tool, Build and preview mindmaps, Online mindmap app, Visual idea organizer, Mindmap collaboration, Customizable mindmaps`}
      image={LogoThumbnail}
    />
  );
};
