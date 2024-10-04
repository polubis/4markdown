import React from 'react';
import type { HeadFC } from 'gatsby';
import Meta from 'components/meta';
import LogoThumbnail from 'images/logo-thumbnail.png';
import { meta } from '../../meta';
import { EducationZoneView } from 'features/education-zone/education-zone.view';
import type { API4MarkdownDto } from 'api-4markdown-contracts';
import { hydrateEducationZone } from 'features/education-zone/store/education-zone.store';

type EducationZonePageProps = {
  pageContext: API4MarkdownDto<'getEducationDashboard'>;
};

const Hydrate = ({ pageContext }: EducationZonePageProps) => {
  hydrateEducationZone(pageContext);
  return null;
};

const EducationZonePage = ({ pageContext }: EducationZonePageProps) => {
  hydrateEducationZone(pageContext);

  return (
    <>
      <Hydrate pageContext={pageContext} />
      <EducationZoneView />;
    </>
  );
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
