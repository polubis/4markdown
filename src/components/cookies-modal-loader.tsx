import React from 'react';
import { useOnFirstInteraction } from 'development-kit/use-on-first-interaction';

const CookiesModal = React.lazy(() =>
  import(`./cookies-modal`).then((m) => ({
    default: m.CookiesModal,
  })),
);

const CookiesModalLoader = () => {
  const { interacted } = useOnFirstInteraction();

  if (interacted)
    return (
      <React.Suspense>
        <CookiesModal />
      </React.Suspense>
    );
};

export { CookiesModalLoader };
