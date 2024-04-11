import { AppNavLink } from 'components/app-nav-link';
import React from 'react';
import { BiGridAlt } from 'react-icons/bi';
import { siteMetadataStoreSelectors } from 'store/site-metadata/site-metadata.store';

const DocsBrowseLinkContainer = () => {
  const siteMetadata = siteMetadataStoreSelectors.useReady();

  return (
    <AppNavLink title="Explore documents" to={siteMetadata.routes.docs.browse}>
      <BiGridAlt size={20} className="mr-2 shrink-0" />
      <span className="text-md font-semibold">Explore</span>
    </AppNavLink>
  );
};

export { DocsBrowseLinkContainer };
