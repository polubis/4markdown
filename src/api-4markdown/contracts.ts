export namespace API4MarkdownAtoms {
  export type Id = string;
  export type Name = string;
  export type Code = string;
  export type Date = string;
  export type Tags = string[];
  export type Path = string;
}

export namespace API4MarkdownDtos {
  export type Document = {
    id: API4MarkdownAtoms.Id;
    name: API4MarkdownAtoms.Name;
    code: API4MarkdownAtoms.Code;
    mdate: API4MarkdownAtoms.Date;
    cdate: API4MarkdownAtoms.Date;
  };
}

export namespace API4MarkdownContracts {
  export type GetDocs = {
    key: 'getDocs';
    payload: {};
    response: {};
  };
}
