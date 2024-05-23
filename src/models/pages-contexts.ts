import { PermamentSlimDoc, PermanentDoc } from './doc';

interface DocsBrowsePageContext {
  docs: PermamentSlimDoc[];
}

interface DocumentPageContext {
  doc: PermanentDoc;
}

export type { DocsBrowsePageContext, DocumentPageContext };
