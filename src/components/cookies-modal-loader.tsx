import React from 'react';
import { isClient } from 'development-kit/ssr-csr';
import { meta } from '../../meta';
import { useOnFirstInteraction } from 'development-kit/use-on-first-interaction';

const CookiesModal = React.lazy(() =>
  import(`./cookies-modal`).then((m) => ({
    default: m.CookiesModal,
  })),
);

const CookiesModalLoader = () => {
  const { interacted } = useOnFirstInteraction();

  if (
    isClient() &&
    interacted &&
    window.location.pathname !== meta.routes.privacyPolicy
  )
    return (
      <React.Suspense>
        <CookiesModal />
      </React.Suspense>
    );
};

export { CookiesModalLoader };
