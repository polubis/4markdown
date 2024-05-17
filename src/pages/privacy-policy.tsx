import React from 'react';
import { HeadFC } from 'gatsby';
import { useSiteMetadataQuery } from 'queries/use-site-metadata-query';
import {
  siteMetadataStoreSelectors,
  useSiteMetadataStore,
} from 'store/site-metadata/site-metadata.store';
import LogoThumbnail from 'images/logo-thumbnail.png';
import Meta from 'components/meta';
import { BackToCreatorLinkContainer } from 'containers/back-to-creator-link.container';
import { DocsBrowseLinkContainer } from 'containers/docs-browse-link.container';
import { AppNavigation } from 'components/app-navigation';
import { AppFooterContainer } from 'containers/app-footer.container';

const PrivacyPolicyPage = () => {
  const synced = React.useRef(false);
  const siteMetadata = useSiteMetadataQuery();

  if (!synced.current) {
    useSiteMetadataStore.setState({
      is: `ready`,
      ...siteMetadata,
    });
    synced.current = true;
  }

  return (
    <>
      <AppNavigation>
        <BackToCreatorLinkContainer />
        <DocsBrowseLinkContainer />
      </AppNavigation>
      <main className="max-w-2xl p-4 mx-auto h-screen flex flex-col justify-center">
        Privacy policy goes here
      </main>
      <AppFooterContainer />
    </>
  );
};

export default PrivacyPolicyPage;

export const Head: HeadFC = () => {
  const meta = siteMetadataStoreSelectors.useReady();

  return (
    <Meta
      appName={meta.appName}
      title={`${meta.appName} Privacy Policy`}
      description="Our Privacy Policy details how we handle personal information, including data collected via Google Analytics. Learn about your rights and our commitment to safeguarding your data"
      keywords={`${meta.appName},${meta.appName} Privacy Policy`}
      url={meta.siteUrl + meta.routes.privacyPolicy}
      lang={meta.lang}
      image={LogoThumbnail}
    />
  );
};
