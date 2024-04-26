import { AppNavLink } from 'components/app-nav-link';
import React from 'react';
import { BiSolidVector } from 'react-icons/bi';
import { siteMetadataStoreSelectors } from 'store/site-metadata/site-metadata.store';

const MindmapCreatorLinkContainer = () => {
  const siteMetadata = siteMetadataStoreSelectors.useReady();

  return (
    <AppNavLink
      title="Go to mindmap creator"
      className="hidden md:flex"
      to={siteMetadata.routes.mindmaps.creator}
    >
      <BiSolidVector size={20} className="mr-2 shrink-0" />
      <span className="text-md font-semibold">Mindmap Creator</span>
    </AppNavLink>
  );
};

export { MindmapCreatorLinkContainer };
