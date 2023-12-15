/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import './src/style/index.css';
import { useOnInteraction } from './src/development-kit/use-on-interaction';

const WithAuth = React.lazy(() => import(`./src/development-kit/with-auth`));

export const wrapPageElement = ({ element }) => {
  const interacted = useOnInteraction();

  return (
    <>
      {element}
      {interacted && (
        <React.Suspense>
          <WithAuth />
        </React.Suspense>
      )}
    </>
  );
};
