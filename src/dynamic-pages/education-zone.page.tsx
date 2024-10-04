import React from 'react';
import type { HeadFC } from 'gatsby';
import Meta from 'components/meta';
import LogoThumbnail from 'images/logo-thumbnail.png';
import { meta } from '../../meta';
import { EducationZoneView } from 'features/education-zone/education-zone.view';
import { EducationZoneProvider } from 'features/education-zone/context/education-zone.context';
import type { EducationZoneViewModel } from 'models/view-models';

type EducationZonePageProps = {
  pageContext: EducationZoneViewModel;
};

const EducationZonePage = ({ pageContext }: EducationZonePageProps) => {
  return (
    <EducationZoneProvider initialState={pageContext}>
      <EducationZoneView />
    </EducationZoneProvider>
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
