import { PermamentSlimDoc, PermanentDoc } from './doc';
import { NullableUserProfile } from './user';

interface DocsBrowsePageContext {
  docs: PermamentSlimDoc[];
}

interface DocumentPageContext {
  doc: PermanentDoc;
  author: NullableUserProfile;
}

export type { DocsBrowsePageContext, DocumentPageContext };
