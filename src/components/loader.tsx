import React from 'react';
import { BiLoaderCircle } from 'react-icons/bi';

const Loader = () => {
  return (
    <div className="fixed left-0 w-full z-50 flex justify-center items-center">
      <BiLoaderCircle className="text-4xl animate-spin light: text-black" />
    </div>
  );
};

export default Loader;
