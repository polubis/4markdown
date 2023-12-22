import { Button } from 'design-system/button';
import React from 'react';

const ErrorScreen = () => {
  const resetAll = (): void => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="p-4 flex flex-col items-center max-w-[280px]">
        <h6 className="text-xl text-center">
          Your session expired. Please click button below.
        </h6>
        <Button
          title="Restart application"
          className="mt-4"
          i={2}
          onClick={resetAll}
        >
          Restart
        </Button>
      </div>
    </div>
  );
};

export default ErrorScreen;
