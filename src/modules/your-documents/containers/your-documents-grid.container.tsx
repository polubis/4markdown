import React, { useEffect, useMemo } from "react";
import { navigate } from "gatsby";
import { differenceInDays, formatDistance } from "date-fns";
import { BiCollection, BiError, BiPencil, BiRefresh } from "react-icons/bi";
import { Button } from "design-system/button";
import { Empty } from "design-system/empty";
import { Err } from "design-system/err";
import { meta } from "../../../../meta";
import { useDocsStore } from "store/docs/docs.store";
import { getYourDocumentsAct } from "acts/get-your-documents.act";
import { reloadYourDocumentsAct } from "acts/reload-your-documents.act";
import { YourDocumentsSkeletonLoader } from "../components/your-documents-skeleton-loader";
import { VisibilityIcon } from "components/visibility-icon";
import type { API4MarkdownDto } from "api-4markdown-contracts";
import type { Atoms } from "api-4markdown-contracts";

type DocItem = API4MarkdownDto<"getYourDocuments">[number];

const getDocumentPreviewUrl = (doc: DocItem): string =>
  `${meta.routes.documents.preview}?id=${doc.id}`;

const hasPreviewUrl = (visibility: Atoms["ResourceVisibility"]): boolean =>
  visibility === "permanent" ||
  visibility === "public" ||
  visibility === "manual";

const getStaticUrl = (doc: DocItem): string | undefined =>
  doc.visibility === "permanent" && "path" in doc && doc.path
    ? doc.path
    : undefined;

const getDescription = (doc: DocItem): string | undefined => {
  if (!("description" in doc) || doc.description == null) return undefined;
  const trimmed =
    typeof doc.description === "string" ? doc.description.trim() : "";
  return trimmed || undefined;
};

const getTags = (doc: DocItem): string[] | undefined => {
  if (!("tags" in doc) || !Array.isArray(doc.tags)) return undefined;
  const filtered = doc.tags.filter(
    (t): t is string => typeof t === "string" && t.trim() !== "",
  );
  return filtered.length > 0 ? filtered : undefined;
};

const TAG_PILL_STYLE =
  "bg-zinc-200 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200";

const getEditedLabel = (mdate: string): string => {
  const date = new Date(mdate);
  const now = new Date();
  const days = differenceInDays(now, date);
  if (days === 0) return "today";
  return formatDistance(now, date, { addSuffix: true });
};

const Content = () => {
  const docsStore = useDocsStore();

  const entries = useMemo(() => {
    if (docsStore.is !== "ok") return [];
    return [...docsStore.docs].sort(
      (a, b) => new Date(b.mdate).getTime() - new Date(a.mdate).getTime(),
    );
  }, [docsStore]);

  if (
    docsStore.is === "idle" ||
    (docsStore.is === "busy" && entries.length === 0)
  ) {
    return (
      <YourDocumentsSkeletonLoader data-testid="[your-documents]:loader" />
    );
  }

  if (docsStore.is === "fail") {
    return (
      <Err>
        <Err.Icon>
          <BiError size={80} />
        </Err.Icon>
        <Err.Title>Something went wrong!</Err.Title>
        <Err.Description>{docsStore.error.message}</Err.Description>
        <Err.Action
          title="Retry loading documents"
          auto
          s={2}
          i={2}
          onClick={() => getYourDocumentsAct()}
        >
          Try Again
        </Err.Action>
      </Err>
    );
  }

  if (entries.length === 0) {
    return (
      <Empty
        id="empty-state-your-documents"
        className="border border-zinc-300 dark:border-zinc-800 rounded-lg p-6"
      >
        <Empty.Icon>
          <BiCollection size={80} />
        </Empty.Icon>
        <Empty.Title id="empty-title-your-documents">
          No documents here
        </Empty.Title>
        <Empty.Description aria-describedby="empty-title-your-documents">
          Start your workspace by creating your first document in the editor.
        </Empty.Description>
        <Empty.Action
          i={2}
          s={2}
          auto
          title="Create your first document"
          aria-label="Create your first document"
          onClick={() => navigate(meta.routes.home)}
        >
          <BiPencil aria-hidden />
          Create first document
        </Empty.Action>
      </Empty>
    );
  }

  return (
    <ul className="columns-1 md:columns-2 lg:columns-3 gap-4 [column-fill:_balance] animate-fade-in">
      {entries.map((doc) => {
        const previewUrl = getDocumentPreviewUrl(doc);
        const staticUrl = getStaticUrl(doc);
        const showPreview = hasPreviewUrl(doc.visibility);
        const description = getDescription(doc);
        const tags = getTags(doc);
        const editedLabel = getEditedLabel(doc.mdate);
        return (
          <li
            key={doc.id}
            className="break-inside-avoid mb-4 p-4 flex flex-col rounded-lg border border-zinc-300 dark:border-zinc-800"
          >
            <div className="flex flex-col min-w-0">
              <div
                className="w-full rounded-lg mb-3 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 min-h-[120px]"
                style={{ maxHeight: "120px" }}
              >
                <span
                  className="text-2xl font-semibold text-zinc-500 dark:text-zinc-400 uppercase"
                  aria-hidden="true"
                >
                  document
                </span>
              </div>
              <div className="flex justify-between items-start gap-2 mb-1">
                <h3 className="text-sm font-medium text-pretty line-clamp-2 min-w-0 flex-1">
                  {doc.name}
                </h3>
                <VisibilityIcon
                  visibility={doc.visibility}
                  className="size-5 shrink-0"
                />
              </div>
              {description !== undefined ? (
                <p
                  className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-4 min-w-0 mt-1 break-words"
                  title={description}
                >
                  {description}
                </p>
              ) : null}
              {tags !== undefined && tags.length > 0 ? (
                <ul
                  className="mt-1 flex flex-wrap gap-1.5 min-w-0 list-none"
                  aria-label="Tags"
                >
                  {tags.map((tag, i) => (
                    <li key={`${tag}-${i}`}>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium break-words ${TAG_PILL_STYLE}`}
                      >
                        {tag}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Edited <span suppressHydrationWarning>{editedLabel}</span>
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2 mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-700">
              <Button
                auto
                title="Open in documents creator"
                aria-label="Edit document in creator"
                s={1}
                i={2}
                onClick={() => navigate(`${meta.routes.home}?id=${doc.id}`)}
              >
                <BiPencil aria-hidden />
                Edit
              </Button>
              {showPreview && (
                <Button
                  auto
                  title="Open preview (live URL)"
                  aria-label="Open document preview"
                  s={1}
                  i={2}
                  onClick={() => navigate(previewUrl)}
                >
                  Preview
                </Button>
              )}
              {staticUrl && (
                <Button
                  auto
                  title="Open static URL"
                  aria-label="Open permanent document URL"
                  s={1}
                  i={2}
                  onClick={() => navigate(staticUrl)}
                >
                  Static URL
                </Button>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

const YourDocumentsGridContainer = () => {
  const docsStore = useDocsStore();

  // Same store and cache as creator (DocBarContainer): getYourDocumentsAct uses getCache/setCache.
  useEffect(() => {
    getYourDocumentsAct();
  }, []);

  const entries = useMemo(() => {
    if (docsStore.is !== "ok") return [];
    return docsStore.docs;
  }, [docsStore]);

  return (
    <div className="max-w-6xl w-full mx-auto animate-fade-in">
      <header className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-pretty">Your documents</h1>
          <Button
            i={2}
            s={1}
            title="Sync documents"
            onClick={() => reloadYourDocumentsAct()}
            disabled={docsStore.is === `busy`}
            aria-label="Refresh documents"
          >
            <BiRefresh />
          </Button>
        </div>
        {docsStore.is === "ok" && entries.length > 0 && (
          <h2 className="text-lg font-semibold font-variant-numeric tabular-nums text-pretty">
            Results: {entries.length}
          </h2>
        )}
      </header>
      <section className="mt-6" aria-label="Your documents grid">
        <Content />
      </section>
    </div>
  );
};

export { YourDocumentsGridContainer };
