/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import ErrorBoundary from './src/development-kit/error-boundary';
import { useAuth } from './src/core/use-auth';
import { CookiesModalLoader } from './src/components/cookies-modal-loader';
import { initAnalytics } from './src/core/analytics';
import './src/style/index.css';

const ExceptionScreen = React.lazy(() =>
  import(`./src/components/exception-screen`).then((m) => ({
    default: m.ExceptionScreen,
  })),
);

const SafeExceptionScreen = () => (
  <React.Suspense>
    <ExceptionScreen />
  </React.Suspense>
);

export const wrapPageElement = ({ element }) => {
  useAuth();

  React.useEffect(() => {
    initAnalytics();
  }, []);

  return (
    <ErrorBoundary fallback={SafeExceptionScreen}>
      {element}
      <CookiesModalLoader />
    </ErrorBoundary>
  );
};
