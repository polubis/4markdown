import React from 'react';
import type { HeadFC } from 'gatsby';
import Meta from 'components/meta';
import LogoThumbnail from 'images/logo-thumbnail.png';
import { meta } from '../../meta';
import { EducationZoneView } from 'features/education-zone/education-zone.view';
import type { EducationPageModel } from 'models/page-models';

type EducationZonePageProps = {
  pageContext: EducationPageModel;
};

const EducationZonePage = ({ pageContext }: EducationZonePageProps) => {
  return <EducationZoneView {...pageContext} />;
};

export default EducationZonePage;

export const Head: HeadFC<unknown, EducationPageModel> = ({
  pageContext: { page, tag, pagesCount },
}) => {
  const prevUrl =
    tag !== undefined || page === 1
      ? undefined
      : `${meta.siteUrl + meta.routes.docs.educationZone}${page - 1}`;
  const nextPage = page + 1;
  const nextUrl =
    tag !== undefined || nextPage > pagesCount
      ? undefined
      : `${meta.siteUrl + meta.routes.docs.educationZone}${nextPage}`;

  return (
    <Meta
      appName={meta.appName}
      title="Explore a Wealth of Knowledge: Articles About Everything"
      description="Embark on a diverse journey through our extensive collection of articles about programming, mathematics, medicine, and more"
      url={meta.siteUrl + meta.routes.docs.educationZone}
      lang={meta.lang}
      image={meta.siteUrl + LogoThumbnail}
      prevUrl={prevUrl}
      nextUrl={nextUrl}
    />
  );
};
