import React from 'react';
import type { HeadFC } from 'gatsby';
import Meta from 'components/meta';
import LogoThumbnail from 'images/logo-thumbnail.png';
import { DocsBrowseView } from 'features/docs-browse/docs-browse.view';
import { DocsBrowsePageContext } from 'models/pages-contexts';
import { meta } from 'core/consts/meta';

interface DocsBrowsePageProps {
  pageContext: DocsBrowsePageContext;
}

const DocsBrowsePage = ({ pageContext }: DocsBrowsePageProps) => {
  return <DocsBrowseView context={pageContext} />;
};

export default DocsBrowsePage;

export const Head: HeadFC = () => {
  return (
    <Meta
      appName={meta.appName}
      title="Explore a Wealth of Knowledge: Articles About Everything"
      description="Embark on a diverse journey through our extensive collection of articles about programming, mathematics, medicine, and more!"
      url={meta.siteUrl + meta.routes.docs.browse}
      lang={meta.lang}
      image={LogoThumbnail}
    />
  );
};
