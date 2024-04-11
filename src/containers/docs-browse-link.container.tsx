import { AppNavLink } from 'components/app-nav-link';
import React from 'react';
import { BiBook } from 'react-icons/bi';
import { siteMetadataStoreSelectors } from 'store/site-metadata/site-metadata.store';

const DocsBrowseLinkContainer = () => {
  const siteMetadata = siteMetadataStoreSelectors.useReady();

  return (
    <AppNavLink
      title="Go to education zone"
      to={siteMetadata.routes.docs.browse}
    >
      <BiBook size={20} className="mr-2 shrink-0" />
      <span className="text-md font-semibold">Education Zone</span>
    </AppNavLink>
  );
};

export { DocsBrowseLinkContainer };
