import type { DocumentDto } from "api-4markdown-contracts";
import { docStoreActions } from "store/doc/doc.store";
import {
	changeWithoutMarkAsUnchangedAction,
	markAsUnchangedAction,
} from "store/document-creator/actions";

const seeInDocumentsCreatorAct = ({
	code,
}: Pick<DocumentDto, "code">): void => {
	docStoreActions.reset();
	markAsUnchangedAction();
	changeWithoutMarkAsUnchangedAction(code);
};

export { seeInDocumentsCreatorAct };
