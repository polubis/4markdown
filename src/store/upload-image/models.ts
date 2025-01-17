import type { API4MarkdownDto } from 'api-4markdown-contracts';
import type { Transaction } from 'development-kit/utility-types';

type UploadImageState = Transaction<API4MarkdownDto<`uploadImage`>>;

export type { UploadImageState };
