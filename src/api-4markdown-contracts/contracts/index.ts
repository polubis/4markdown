import type { DocumentDto } from '../dtos';

type GetDocsContract = {
  key: 'getDocs';
  dto: DocumentDto[];
};

type API4MarkdownContracts = GetDocsContract;

export type { API4MarkdownContracts };
