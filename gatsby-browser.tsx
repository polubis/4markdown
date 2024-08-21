/* eslint-disable react-hooks/rules-of-hooks */
import React, { lazy, Suspense } from 'react';
import './src/style/index.css';
import ErrorBoundary from './src/development-kit/error-boundary';
import { useAuth } from './src/core/use-auth';

const ExceptionScreen = lazy(() => import(`./src/components/exception-screen`));

const SafeExceptionScreen = () => (
  <Suspense>
    <ExceptionScreen />
  </Suspense>
);

export const wrapPageElement = ({ element }) => {
  useAuth();

  return (
    <ErrorBoundary fallback={SafeExceptionScreen}>{element}</ErrorBoundary>
  );
};
