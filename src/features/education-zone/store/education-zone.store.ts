import { create } from 'zustand';
import type { EducationZoneStoreState } from './education-zone.models';

const useEducationZoneStore = create<EducationZoneStoreState>(() => ({
  is: `idle`,
}));

const { setState: set, getState: get } = useEducationZoneStore;

const hydrateEducationZone = (
  state: Omit<EducationZoneStoreState, 'is'>,
): void => {
  if (get().is === `ready`) {
    return;
  }

  set({
    ...state,
    is: `ready`,
  });
};

export { useEducationZoneStore, hydrateEducationZone };
