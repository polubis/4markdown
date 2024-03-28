import React from 'react';
import { Link } from 'gatsby';
import { BiArrowBack } from 'react-icons/bi';
import { siteMetadataStoreSelectors } from 'store/site-metadata/site-metadata.store';

const BackToCreatorLinkContainer = () => {
  const siteMetadata = siteMetadataStoreSelectors.useReady();

  return (
    <Link
      to={siteMetadata.routes.home}
      className="cursor-pointer no-underline flex items-center ml-2 dark:hover:text-white/80 hover:text-black/80"
    >
      <BiArrowBack size={20} className="mr-2 shrink-0" />
      <span className="text-md font-semibold">Back to Creator</span>
    </Link>
  );
};

export { BackToCreatorLinkContainer };
