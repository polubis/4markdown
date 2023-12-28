import { Button } from 'design-system/button';
import { navigate } from 'gatsby';
import React from 'react';
import { siteMetadataStoreSelectors } from 'store/site-metadata/site-metadata.store';

const ErrorScreen = () => {
  const siteMetadataStore = siteMetadataStoreSelectors.useReady();

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="p-4 flex flex-col items-center max-w-[280px]">
        <h6 className="text-xl text-center">
          This page is not available anymore. It may be wrong{` `}
          <strong>ID</strong> or lack of permissions
        </h6>

        <Button
          title="Go to editor"
          className="mt-4"
          rfull
          i={2}
          onClick={() => navigate(siteMetadataStore.routes.home)}
        >
          Go To Editor
        </Button>
      </div>
    </div>
  );
};

export default ErrorScreen;
