import { PermamentSlimDoc, PermanentDoc, NullableDocAuthor } from './doc';

interface DocsBrowsePageContext {
  docs: PermamentSlimDoc[];
}

interface DocumentPageContext {
  doc: PermanentDoc;
  author: NullableDocAuthor;
}

export type { DocsBrowsePageContext, DocumentPageContext };
