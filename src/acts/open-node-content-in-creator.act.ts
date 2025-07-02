import { docStoreActions } from "store/doc/doc.store";
import { changeWithoutMarkAsUnchangedAction } from "store/document-creator/actions";
import type { DocumentCreatorState } from "store/document-creator/models";
import { meta } from "../../meta";

const openNodeContentInCreatorAct = (
	code: DocumentCreatorState["code"],
): void => {
	docStoreActions.reset();
	changeWithoutMarkAsUnchangedAction(code);
	window.open(meta.routes.home, `_blank`);
};

export { openNodeContentInCreatorAct };
