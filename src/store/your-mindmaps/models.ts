import type { API4MarkdownDto } from 'api-4markdown-contracts';
import type { Transaction } from 'development-kit/utility-types';

type YourMindmapsState = Transaction<API4MarkdownDto<`getYourMindmaps`>>;

export type { YourMindmapsState };
