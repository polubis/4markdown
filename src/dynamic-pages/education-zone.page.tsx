import React from 'react';
import type { HeadFC } from 'gatsby';
import Meta from 'components/meta';
import LogoThumbnail from 'images/logo-thumbnail.png';
import { DocsBrowseView } from 'features/docs-browse/docs-browse.view';
import { EducationZonePageContext } from 'models/pages-contexts';
import { meta } from '../../meta';

interface EducationZonePageProps {
  pageContext: EducationZonePageContext;
}

const EducationZonePage = ({ pageContext }: EducationZonePageProps) => {
  return <DocsBrowseView context={pageContext} />;
};

export default EducationZonePage;

export const Head: HeadFC = () => {
  return (
    <Meta
      appName={meta.appName}
      title="Explore a Wealth of Knowledge: Articles About Everything"
      description="Embark on a diverse journey through our extensive collection of articles about programming, mathematics, medicine, and more!"
      url={meta.siteUrl + meta.routes.docs.educationZone}
      lang={meta.lang}
      image={LogoThumbnail}
    />
  );
};
