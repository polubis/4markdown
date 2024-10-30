import React from 'react';
import type { HeadFC } from 'gatsby';
import Meta from 'components/meta';
import LogoThumbnail from 'images/logo-thumbnail.png';
import { meta } from '../../meta';
import { SubscribeNewsletterView } from 'features/subscribe-newsletter/subscribe-newsletter.view';

const SubscribeNewsletterPage = () => {
  return <SubscribeNewsletterView />;
};

export default SubscribeNewsletterPage;

export const Head: HeadFC = () => {
  return (
    <Meta
      appName={meta.appName}
      title={`${meta.appName} Subscribe Newsletter`}
      description="Subscribe to our weekly web dev newsletter and hop aboard the knowledge train"
      keywords={`${meta.appName},${meta.appName} Subscribe Newsletter`}
      url={meta.siteUrl + meta.routes.newsletter.subscribe}
      lang={meta.lang}
      image={LogoThumbnail}
    />
  );
};
