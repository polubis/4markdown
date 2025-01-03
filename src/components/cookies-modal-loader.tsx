import { observeFirstInteraction } from 'development-kit/observe-first-interaction';
import { isClient } from 'development-kit/ssr-csr';
import React from 'react';
import { meta } from '../../meta';

const CookiesModal = React.lazy(() =>
  import(`./cookies-modal`).then((m) => ({
    default: m.CookiesModal,
  })),
);

const CookiesModalLoader = () => {
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    observeFirstInteraction(() => setLoaded(true));
  }, []);

  if (
    isClient() &&
    loaded &&
    window.location.pathname !== meta.routes.privacyPolicy
  )
    return (
      <React.Suspense>
        <CookiesModal />
      </React.Suspense>
    );
};

export { CookiesModalLoader };
