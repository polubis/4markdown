import React from 'react';
import Meta from 'components/meta';
import LogoThumbnail from 'images/logo-thumbnail.png';
import { meta } from '../../meta';
import { CreateMindmapView } from 'features/create-mindmap/create-mindmap.view';

const CreateMindmap = () => {
  return <CreateMindmapView />;
};

export default CreateMindmap;

export const Head = () => {
  return (
    <Meta
      appName={meta.appName}
      title={`Create Your First Mindmap | ${meta.appName}`}
      description={`Discover how to create your first mindmap with ${meta.appName}. This beginner-friendly tool helps you organize thoughts, ideas, and information visually. Start building your first mindmap and experience the power of structured thinking`}
      url={meta.siteUrl + meta.routes.mindmap.create}
      lang={meta.lang}
      keywords={`Create first mindmap, Mindmap for beginners, Start your first mindmap, How to build a mindmap, Mindmap tutorial, ${meta.appName}, Beginner's mindmap tool, Visual idea organization`}
      image={LogoThumbnail}
    />
  );
};
