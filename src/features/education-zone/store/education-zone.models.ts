import type { EducationZoneViewModel } from 'models/view-models';

type EducationZoneStoreState =
  | {
      is: `idle`;
    }
  | ({
      is: `ready`;
    } & EducationZoneViewModel);

export type { EducationZoneStoreState };
