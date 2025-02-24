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

const enum Visibility {
  Private = `private`,
  Public = `public`,
  Permanent = `permanent`,
}

export type {
  Id,
  Name,
  MarkdownCode,
  MarkdownContent,
  Url,
  Date,
  Tags,
  Path,
  Description,
  Base64,
  Slug,
};
export { Visibility };
