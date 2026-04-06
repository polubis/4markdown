import { getAPI, parseError, setCache } from "api-4markdown";
import type { Atoms } from "api-4markdown-contracts";
import type { AsyncResult } from "development-kit/utility-types";
import { docManagementStoreActions } from "store/doc-management/doc-management.store";
import { docStoreActions } from "store/doc/doc.store";
import { docsStoreActions, docsStoreSelectors } from "store/docs/docs.store";
import { useMarkdownPostCreatorState } from "store/markdown-post-creator";
import { resetAction } from "store/markdown-post-creator/actions";

const createMarkdownPostAct = async (): AsyncResult<{
  id: Atoms["DocumentId"];
}> => {
  const { title, content } = useMarkdownPostCreatorState.get();

  try {
    docManagementStoreActions.busy();

    const createdDocument = await getAPI().call(`createDocument`)({
      name: title,
      code: content,
    });

    docManagementStoreActions.ok();
    docStoreActions.setActive(createdDocument);

    const docsState = docsStoreSelectors.state();

    if (docsState.is === `ok`) {
      docsStoreActions.addDoc(createdDocument);
      setCache(`getYourDocuments`, docsStoreSelectors.ok().docs);
    }

    resetAction();

    return { is: `ok`, data: { id: createdDocument.id } };
  } catch (error: unknown) {
    docManagementStoreActions.fail(error);

    return { is: `fail`, error: parseError(error) };
  }
};

export { createMarkdownPostAct };
