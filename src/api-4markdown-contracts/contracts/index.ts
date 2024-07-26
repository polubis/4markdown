import type { Id } from '../atoms';
import type { DocumentDto } from '../dtos';

type Contract<TKey extends string, TDto, TPayload = undefined> = {
  key: TKey;
  dto: TDto;
  payload: TPayload;
};

type GetDocsContract = Contract<`getDocs`, DocumentDto[]>;
type GetPublicDocContract = Contract<`getPublicDoc`, DocumentDto, { id: Id }>;

type API4MarkdownContracts = GetDocsContract | GetPublicDocContract;

export type { API4MarkdownContracts, GetDocsContract, GetPublicDocContract };
