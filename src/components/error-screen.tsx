import { Button } from 'design-system/button';
import { navigate } from 'gatsby';
import React from 'react';
import { meta } from '../../meta';
// @TODO[PRIO=4]: [No default exports in app - add maybe rule and fix every place where it's used].
const ErrorScreen = () => {
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
          auto
          s={2}
          i={2}
          onClick={() => navigate(meta.routes.home)}
        >
          Go To Editor
        </Button>
      </div>
    </div>
  );
};

export default ErrorScreen;
