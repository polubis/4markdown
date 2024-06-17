type Id = string;
type Date = string;
type Code = string;
type Name = string;
type Path = string;
type Tags = string[];
type Base64 = string;
type ImageNode = {
  h: number;
  w: number;
  src: Path;
};

export type { Id, Date, Code, Name, Path, Tags, Base64, ImageNode };
