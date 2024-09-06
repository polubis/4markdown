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
      title={`Create mindmaps and build your second brain`}
      description={`Use this powerful creator to build mindmaps and link your materials. Share them with others and contribute to each other's work`}
      url={meta.siteUrl + meta.routes.mindmap.creator}
      lang={meta.lang}
      keywords={`${meta.appName}, Mindmap creator, Online mindmap builder, Online mindmap editor`}
      image={LogoThumbnail}
    />
  );
};
