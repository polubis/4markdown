import { SiteMetadata } from 'models/queries';
import { create } from 'zustand';

type SiteMetadataStoreStateIdle = { is: 'idle' };
type SiteMetadataStoreStateReady = { is: 'ready' } & SiteMetadata;

type SiteMetadataStoreState =
  | SiteMetadataStoreStateIdle
  | SiteMetadataStoreStateReady;

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

const siteMetadataStoreSelectors = {
  useReady: () => useSiteMetadataStore(getReady),
} as const;

export { useSiteMetadataStore, siteMetadataStoreSelectors };
