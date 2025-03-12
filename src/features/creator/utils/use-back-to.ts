import { isServer } from 'development-kit/ssr-csr';
import { navigate } from 'gatsby';
import React from 'react';
import { meta } from '../../../../meta';

type BackToState = { is: `off` } | { is: `on`; backToPath: string };

const getBackToPathFromUrl = (): BackToState => {
  if (isServer()) {
    return { is: `off` };
  }

  const backToParam = new URLSearchParams(window.location.search).get(`backTo`);

  if (!backToParam) {
    return { is: `off` };
  }

  const decodedPath = decodeURIComponent(backToParam);
  const whiteList: string[] = [meta.routes.mindmaps.creator];

  if (!whiteList.includes(decodedPath)) {
    return { is: `off` };
  }

  return {
    is: `on`,
    backToPath: decodedPath,
  };
};

const useBackTo = () => {
  const [state, setState] = React.useState(getBackToPathFromUrl);

  return React.useMemo(
    () => ({
      ...state,
      backTo: (): void => {
        if (state.is === `off`) return;

        navigate(state.backToPath, { replace: true });
      },
      denyBackTo: (): void => {
        const searchParams = new URLSearchParams(location.search);

        if (searchParams.has(`backTo`)) {
          searchParams.delete(`backTo`);
          const newUrl = `${location.pathname}?${searchParams.toString()}`;
          window.history.replaceState({}, ``, newUrl);
        }

        setState({ is: `off` });
        navigate(meta.routes.home, { replace: true });
      },
    }),
    [state],
  );
};

export { useBackTo };
