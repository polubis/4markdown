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

const ASSISTANT_PERSONAS = [`jelly`, `kate`, `josh`] as const;

type AssistantPersona = (typeof ASSISTANT_PERSONAS)[number];

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
  AssistantPersona,
};
export { ASSISTANT_PERSONAS };
