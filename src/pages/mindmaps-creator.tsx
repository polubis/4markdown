import React from 'react';
import type { HeadFC } from 'gatsby';
import Meta from 'components/meta';
import LogoThumbnail from 'images/logo-thumbnail.png';
import { meta } from '../../meta';
import { MindmapsCreatorView } from 'features/mindmaps-creator/mindmaps-creator.view';

const MindmapsCreatorPage = () => {
  return <MindmapsCreatorView />;
};

export default MindmapsCreatorPage;

export const Head: HeadFC = () => {
  return (
    <Meta
      appName={meta.appName}
      title={`Create mind maps and build a knowledge base`}
      description={`Use this powerful creator to build mindmaps and link your materials. Share them with others and contribute to each other's work`}
      url={meta.siteUrl + meta.routes.mindmaps.creator}
      lang={meta.lang}
      keywords={`${meta.appName}, Mindmaps creator, Online mindmaps builder, Online mindmaps editor`}
      image={LogoThumbnail}
    />
  );
};
