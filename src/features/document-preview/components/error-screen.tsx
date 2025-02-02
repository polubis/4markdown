import { Button } from 'design-system/button';
import React from 'react';
import { meta } from '../../../../meta';
import { navigate } from 'gatsby';

const ErrorScreen = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="p-4 flex flex-col items-center max-w-[420px]">
        <h6 className="text-xl text-center">
          This page is not available anymore. It may be wrong{` `}
          <strong>ID</strong> or lack of permissions
        </h6>
        <Button
          title="Go to document creator"
          className="mt-4"
          auto
          s={2}
          i={2}
          onClick={() => navigate(meta.routes.home)}
        >
          Go To Document Creator
        </Button>
      </div>
    </div>
  );
};

export { ErrorScreen };
