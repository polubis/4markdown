import { Loader } from 'design-system/loader';
import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="p-4 flex flex-col items-center max-w-[280px]">
        <h6 className="text-xl text-center">
          Wait... Checking required stuff (～￣▽￣)～
        </h6>
        <Loader className="mt-6" size="xl" />
      </div>
    </div>
  );
};

export default LoadingScreen;
