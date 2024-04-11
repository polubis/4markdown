import React from 'react';
import { Link } from 'gatsby';
import { BiGridAlt } from 'react-icons/bi';
import { siteMetadataStoreSelectors } from 'store/site-metadata/site-metadata.store';

const DocsBrowseLinkContainer = () => {
  const siteMetadata = siteMetadataStoreSelectors.useReady();

  return (
    <Link
      title="Explore documents"
      activeClassName="active-link"
      to={siteMetadata.routes.docs.browse}
      className="cursor-pointer no-underline flex items-center ml-2 dark:hover:text-white/80 hover:text-black/80"
    >
      <BiGridAlt size={20} className="mr-2 shrink-0" />
      <span className="text-md font-semibold">Explore</span>
    </Link>
  );
};

export { DocsBrowseLinkContainer };
