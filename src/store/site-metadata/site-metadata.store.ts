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

const siteMetadatStoreSelectors: SiteMetadataStoreSelectors = {
  useReady: () => {
    return useSiteMetadataStore((state) => {
      if (state.is === `idle`) {
        throw Error(`Trying to read state when not ready`);
      }

      return state;
    });
  },
};

export { useSiteMetadataStore, siteMetadatStoreSelectors };
