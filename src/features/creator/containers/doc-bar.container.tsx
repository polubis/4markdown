import React from "react";
import { useLocation } from "@reach/router";
import { useDocStore } from "store/doc/doc.store";
import { useDocsStore } from "store/docs/docs.store";
import { useAuthStore } from "store/auth/auth.store";
import { YourDocumentsContainer } from "./your-documents.container";
import { getYourDocumentsAct } from "acts/get-your-documents.act";
import { docStoreActions } from "store/doc/doc.store";
import { getAPI } from "api-4markdown";
import type { Atoms } from "api-4markdown-contracts";
import type { API4MarkdownDto } from "api-4markdown-contracts";

const ActiveDocumentBarContainer = React.lazy(
  () => import(`./active-document-bar.container`),
);

const DocBarLoader = () => (
  <div className="flex gap-2">
    <div className="w-20 h-8 rounded-md bg-gray-300 dark:bg-gray-800" />
    <div className="w-4 h-8 rounded-md bg-gray-300 dark:bg-gray-800" />
    <div className="w-10 h-8 rounded-md bg-gray-300 dark:bg-gray-800" />
  </div>
);

const DocBarContainer = () => {
  const location = useLocation();
  const docStore = useDocStore();
  const docsStore = useDocsStore();
  const authStore = useAuthStore();

  React.useEffect(() => {
    authStore.is === `authorized` && getYourDocumentsAct();
  }, [authStore]);

  const openedIdRef = React.useRef<string | null>(null);
  React.useEffect(() => {
    if (authStore.is !== `authorized`) return;
    const params = new URLSearchParams(location.search);
    const documentId = params.get(`id`);
    if (!documentId) return;
    if (docsStore.is === `ok`) {
      const doc = docsStore.docs.find((d) => d.id === documentId);
      if (doc) {
        if (openedIdRef.current !== documentId) {
          openedIdRef.current = documentId;
          docStoreActions.setActive(doc);
        }
        return;
      }
    }
    if (openedIdRef.current === documentId) return;
    openedIdRef.current = documentId;
    getAPI()
      .call(`getAccessibleDocument`)({
        documentId: documentId as Atoms["DocumentId"],
      })
      .then((document) => {
        docStoreActions.setActive(
          document as API4MarkdownDto<`getYourDocuments`>[number],
        );
      })
      .catch(() => {
        openedIdRef.current = null;
      });
  }, [authStore.is, location.search, docsStore.is]);

  return (
    <>
      {authStore.is === `idle` && <DocBarLoader />}
      {authStore.is === `authorized` && (
        <>
          {docStore.is === `idle` ? (
            <>
              <h6
                className="font-bold text-lg max-w-[260px] truncate mr-4"
                title="Markdown Editor"
              >
                Markdown Editor
              </h6>
              <div className="flex items-center gap-2">
                <YourDocumentsContainer />
              </div>
            </>
          ) : (
            <React.Suspense fallback={<DocBarLoader />}>
              <ActiveDocumentBarContainer />
            </React.Suspense>
          )}
        </>
      )}
      {authStore.is === `unauthorized` && (
        <h6 className="font-bold text-lg truncate mr-4" title="Markdown Editor">
          Markdown Editor
        </h6>
      )}
    </>
  );
};

export { DocBarContainer };
