import React from 'react';
import type { HeadFC } from 'gatsby';
import Meta from 'components/meta';
import LogoThumbnail from 'images/logo-thumbnail.png';
import DocPreviewView from 'features/doc-preview/doc-preview.view';
import { meta } from 'core/consts/meta';

const DocsPreviewPage = () => {
  return <DocPreviewView />;
};

export default DocsPreviewPage;

export const Head: HeadFC = () => {
  return (
    <Meta
      appName={meta.appName}
      title={meta.title}
      description={meta.description}
      url={meta.siteUrl + meta.routes.docs.preview}
      lang={meta.lang}
      image={LogoThumbnail}
      robots="noindex, nofollow"
    />
  );
};
