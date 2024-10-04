import type { API4MarkdownDto } from 'api-4markdown-contracts';

type EducationZoneStoreState =
  | {
      is: `idle`;
    }
  | ({
      is: `ready`;
    } & API4MarkdownDto<'getEducationDashboard'>);

export type { EducationZoneStoreState };
