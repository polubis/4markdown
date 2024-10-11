type Id = string;
type Name = string;
type MarkdownCode = string;
type Date = string;
type Tags = string[];
type Path = string;
type Description = string;
type Base64 = string;
type ImageAction =
  | { type: `noop` }
  | { type: `remove` }
  | { type: `update`; data: Base64 };

export type {
  Id,
  Name,
  MarkdownCode,
  Date,
  Tags,
  Path,
  Description,
  Base64,
  ImageAction,
};
