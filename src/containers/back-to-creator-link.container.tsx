import React from 'react';
import { BiArrowBack } from 'react-icons/bi';
import { siteMetadataStoreSelectors } from 'store/site-metadata/site-metadata.store';
import { AppNavLink } from 'components/app-nav-link';

const BackToCreatorLinkContainer = () => {
  const siteMetadata = siteMetadataStoreSelectors.useReady();

  return (
    <AppNavLink title="Back to creator" to={siteMetadata.routes.home}>
      <BiArrowBack size={20} className="mr-2 shrink-0" />
      <span className="text-md font-semibold">Back to Creator</span>
    </AppNavLink>
  );
};

export { BackToCreatorLinkContainer };
