import { state } from 'development-kit/state';

type ChaptersViewStoreState = { is: 'chapters' } | { is: 'full' };

const useChaptersViewState = state<ChaptersViewStoreState>({
  is: 'full',
});

const chaptersViewActions = {
  toggle: (): void => {
    const current = useChaptersViewState.get().is;
    useChaptersViewState.set({ is: current === 'full' ? 'chapters' : 'full' });
  },
  reset: (): void => {
    useChaptersViewState.reset();
  },
};

const useIsChaptersView = () =>
  useChaptersViewState((state) => state.is === 'chapters');

export { useIsChaptersView, chaptersViewActions };
