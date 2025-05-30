import { type Brand } from 'development-kit/utility-types';

type Id = string;
type Name = string;
type MarkdownCode = string;
type Date = string;
type Tags = string[];
type Path = string;
type MarkdownContent = string;
type Description = string;
type Base64 = string;
type Slug = string;
type Url = string;
type UserId = Brand<string, `UserId`>;

export type {
  Id,
  Name,
  MarkdownCode,
  MarkdownContent,
  Url,
  Date,
  UserId,
  Tags,
  Path,
  Description,
  Base64,
  Slug,
};
