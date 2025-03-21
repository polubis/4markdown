import React from 'react';
import { type HeadFC } from 'gatsby';
import Meta from 'components/meta';
import LogoThumbnail from 'images/logo-thumbnail.png';
import { meta } from '../../meta';
import type { MindmapPageModel } from 'models/page-models';

interface MindmapPageProps {
  pageContext: MindmapPageModel;
}

const MindmapPage = ({ pageContext }: MindmapPageProps) => {
  return (
    <>
      <h1>{pageContext.mindmap.name}</h1>
    </>
  );
};

export default MindmapPage;

export const Head: HeadFC<unknown, MindmapPageProps['pageContext']> = ({
  pageContext,
}) => {
  return (
    <Meta
      appName={meta.appName}
      title={pageContext.mindmap.name}
      description={pageContext.mindmap.description ?? pageContext.mindmap.name}
      url={`${meta.siteUrl}${pageContext.mindmap.path}`}
      keywords={`${meta.appName}, ${pageContext.mindmap.name}`}
      lang={meta.lang}
      image={meta.siteUrl + LogoThumbnail}
    />
  );
};
