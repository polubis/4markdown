/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import ErrorBoundary from './src/development-kit/error-boundary';
import { useAuth } from './src/core/use-auth';
import { CookiesModalLoader } from './src/components/cookies-modal-loader';
import { useSUIDGeneration } from './src/core/session-stamps';
import 'katex/dist/katex.min.css';
import 'prismjs/themes/prism-okaidia.css';
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
  useSUIDGeneration();
  useAuth();

  return (
    <ErrorBoundary fallback={SafeExceptionScreen}>
      {element}
      <CookiesModalLoader />
    </ErrorBoundary>
  );
};
