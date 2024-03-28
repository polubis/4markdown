import { SiteMetadata } from 'models/queries';
import { create } from 'zustand';

type SiteMetadataStoreStateIdle = { is: 'idle' };
type SiteMetadataStoreStateReady = { is: 'ready' } & SiteMetadata;

type SiteMetadataStoreState =
  | SiteMetadataStoreStateIdle
  | SiteMetadataStoreStateReady;

interface SiteMetadataStoreSelectors {
  useReady(): SiteMetadataStoreStateReady;
}

const useSiteMetadataStore = create<SiteMetadataStoreState>(() => ({
  is: `idle`,
}));

const getReady = (
  state: SiteMetadataStoreState,
): SiteMetadataStoreStateReady => {
  if (state.is === `idle`) {
    throw Error(`Trying to read state when not ready`);
  }

  return state;
};

const siteMetadataStoreSelectors: SiteMetadataStoreSelectors = {
  useReady: () => useSiteMetadataStore(getReady),
};

export { useSiteMetadataStore, siteMetadataStoreSelectors };
