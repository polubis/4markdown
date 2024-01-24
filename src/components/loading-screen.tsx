import React from 'react';
import Logo from '../images/icon.png';
import c from 'classnames';

interface ImageProps {
  src: string;
  alt: string;
  customClasses: 'red' | 'green' | 'blue';
}

const GlitchImage: React.FC<ImageProps> = ({ src, alt, customClasses }) => (
  <div
    className={c(
      `absolute top-0 left-0 w-full h-full overflow-hidden`,
      customClasses,
    )}
  >
    <img className="w-full h-full absolute" src={src} alt={alt} />
  </div>
);

const LoadingScreen: React.FC = () => (
  <div className="flex flex-col justify-center items-center h-screen">
    <div className="p-4 flex flex-col items-center max-w-[280px] relative">
      <h6 className="text-xl text-center mb-4">
        Content is loading, please wait...
      </h6>
      <div className="relative w-20 h-20 overflow-hidden">
        <GlitchImage src={Logo} alt="Loading Image" customClasses="red" />
        <GlitchImage src={Logo} alt="Loading Image" customClasses="green" />
        <GlitchImage src={Logo} alt="Loading Image" customClasses="blue" />
      </div>
    </div>
  </div>
);

export default LoadingScreen;
