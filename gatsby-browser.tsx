/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import './src/style/index.css';
import ErrorBoundary from './src/development-kit/error-boundary';
import { useOnInteraction } from './src/development-kit/use-on-interaction';

const WithAuth = React.lazy(() => import(`./src/development-kit/with-auth`));
const ExceptionScreen = React.lazy(
  () => import(`./src/components/exception-screen`),
);

const SafeExceptionScreen = () => (
  <React.Suspense>
    <ExceptionScreen />
  </React.Suspense>
);

export const wrapPageElement = ({ element }) => {
  const interacted = useOnInteraction();

  return (
    <ErrorBoundary fallback={SafeExceptionScreen}>
      {element}
      {interacted && (
        <React.Suspense>
          <WithAuth />
        </React.Suspense>
      )}
    </ErrorBoundary>
  );
};
