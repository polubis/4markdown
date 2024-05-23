import { PermamentSlimDoc, PermanentDoc, DocAuthor } from './doc';

interface DocsBrowsePageContext {
  docs: PermamentSlimDoc[];
}

interface DocumentPageContext {
  doc: PermanentDoc;
  author: DocAuthor;
}

export type { DocsBrowsePageContext, DocumentPageContext };
