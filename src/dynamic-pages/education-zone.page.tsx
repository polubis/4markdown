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

export const Head: HeadFC<object, EducationPageModel> = ({
  pageContext: { page, tag },
}) => {
  const noTag = tag === undefined;
  const isCanonical = page === 1 && noTag;

  return (
    <Meta
      appName={meta.appName}
      title="Explore a Wealth of Knowledge: Articles About Everything"
      description="Embark on a diverse journey through our extensive collection of articles about programming, mathematics, medicine, and more"
      url={meta.siteUrl + meta.routes.docs.educationZone}
      lang={meta.lang}
      image={LogoThumbnail}
      robots={isCanonical ? undefined : `noindex, nofollow`}
      prevUrl={
        noTag && page > 1
          ? `${meta.siteUrl + meta.routes.docs.educationZone}${page + 1}`
          : undefined
      }
      nextUrl={
        noTag && page > 1
          ? `${meta.siteUrl + meta.routes.docs.educationZone}${page - 1}`
          : undefined
      }
    />
  );
};
