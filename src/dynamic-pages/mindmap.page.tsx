import React from 'react';
import { type HeadFC } from 'gatsby';
import Meta from 'components/meta';
import LogoThumbnail from 'images/logo-thumbnail.png';
import { meta } from '../../meta';
import type { API4MarkdownDto } from 'api-4markdown-contracts';

interface DocumentPageProps {
  pageContext: {
    mindmap: API4MarkdownDto<`getPermanentMindmaps`>[number];
  };
}

const MindmapPage = ({ pageContext }: DocumentPageProps) => {
  return (
    <>
      <h1>{pageContext.mindmap.name}</h1>
    </>
  );
};

export default MindmapPage;

export const Head: HeadFC<unknown, DocumentPageProps['pageContext']> = ({
  pageContext,
}) => {
  return (
    <Meta
      appName={meta.appName}
      title={pageContext.mindmap.name}
      description={pageContext.mindmap.description ?? undefined}
      url={`${meta.siteUrl}${pageContext.mindmap.path}`}
      keywords={`${meta.appName}, ${pageContext.mindmap.name}`}
      lang={meta.lang}
      image={meta.siteUrl + LogoThumbnail}
    />
  );
};
