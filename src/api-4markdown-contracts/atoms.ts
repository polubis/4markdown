type Id = string;
type Name = string;
type MarkdownCode = string;
type Date = string;
type Tags = string[];
type Path = string;
type Description = string;
type Base64 = string;
type Paginated = {
  page: number;
  totalPages: number;
};
type PaginationLimit = 10 | 25 | 50 | 100;
type Pagination = { limit: PaginationLimit; page: number };

export type {
  Id,
  Name,
  MarkdownCode,
  Date,
  Tags,
  Path,
  Description,
  Base64,
  Paginated,
  Pagination,
  PaginationLimit,
};
