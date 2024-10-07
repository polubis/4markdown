import type { API4MarkdownDto } from 'api-4markdown-contracts';

type HomeViewModel = {
  initialCode: string;
};

// @TODO[PRIO=4]: [Split models to separate files].
type EducationZoneViewModel = {
  page: number;
  pagesCount: number;
} & API4MarkdownDto<'getEducationDashboard'>;

type EducationRankViewModel = {
  top: API4MarkdownDto<'getEducationDashboard'>['documents']['wall'];
};

export type { HomeViewModel, EducationZoneViewModel, EducationRankViewModel };
