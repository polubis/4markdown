import React from 'react';
import type { HeadFC } from 'gatsby';
import LogoThumbnail from 'images/logo-thumbnail.png';
import Meta from 'components/meta';
import { meta } from '../../meta';
import { NewMindmapView } from 'features/new-mindmap/new-mindmap.view';

const NewMindmapPage = () => {
  return <NewMindmapView />;
};

export default NewMindmapPage;

export const Head: HeadFC = () => {
  return (
    <Meta
      appName={meta.appName}
      title="Start Building Your Second Brain and Create a New Mindmap"
      description="Set up your first mindmap quickly, organize your thoughts, and learn new things effortlessly to build your second brain with ease"
      url={meta.siteUrl + meta.routes.notFound}
      lang={meta.lang}
      image={meta.siteUrl + LogoThumbnail}
    />
  );
};
