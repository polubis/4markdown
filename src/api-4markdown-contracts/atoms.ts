type Id = string;
type Name = string;
type MarkdownContent = string;
type Date = string;
type Tags = string[];
type Path = string;
type Description = string;
type Base64 = string;
type Slug = string;
type Url = string;

const enum Visibility {
  Private = `private`,
  Public = `public`,
  Permanent = `permanent`,
}

export { Visibility };
export type {
  Id,
  Name,
  MarkdownContent,
  Date,
  Tags,
  Path,
  Description,
  Base64,
  Slug,
  Url,
};
