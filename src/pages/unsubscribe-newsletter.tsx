import React from 'react';
import type { HeadFC } from 'gatsby';
import Meta from 'components/meta';
import LogoThumbnail from 'images/logo-thumbnail.png';
import { meta } from '../../meta';
import { UnsubscribeNewsletterView } from 'features/unsubscribe-newsletter/unsubscribe-newsletter.view';

const UnsubscribeNewsletterPage = () => {
  return <UnsubscribeNewsletterView />;
};

export default UnsubscribeNewsletterPage;

export const Head: HeadFC = () => {
  return (
    <Meta
      appName={meta.appName}
      title={`${meta.appName} Unsubscribe Newsletter`}
      description="Unsubscribe Newsletter and learn how we protect your data. See our Privacy Policy for details on data usage and your rights"
      keywords={`${meta.appName},${meta.appName} Unsubscribe Newsletter`}
      url={meta.siteUrl + meta.routes.newsletter.unsubscribe}
      lang={meta.lang}
      image={LogoThumbnail}
    />
  );
};
