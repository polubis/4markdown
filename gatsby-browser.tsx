/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import './src/style/index.css';
import ErrorBoundary from './src/development-kit/error-boundary';
import { useAuth } from './src/core/use-auth';

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

  return (
    <ErrorBoundary fallback={SafeExceptionScreen}>{element}</ErrorBoundary>
  );
};
