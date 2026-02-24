import React, { useEffect, useMemo, useState } from "react";
import { Link } from "gatsby";
import {
  BiCheckCircle,
  BiError,
  BiInfoCircle,
  BiRefresh,
  BiTrash,
} from "react-icons/bi";
import { Button } from "design-system/button";
import { Checkbox } from "design-system/checkbox";
import { Switch } from "design-system/switch";
import { Empty } from "design-system/empty";
import { Err } from "design-system/err";
import { Modal2 } from "design-system/modal2";
import { useFeature } from "@greenonsoftware/react-kit";
import { useMutation } from "core/use-mutation";
import {
  API4MarkdownError,
  ResourceCompletionDto,
} from "api-4markdown-contracts";
import { meta } from "../../../../meta";
import { useResourcesCompletionState } from "../store";
import { rawResourcesCompletionSelector } from "../store/selectors";
import { loadResourceCompletionsAct } from "../acts/load-resource-completions.act";
import { reloadResourceCompletionsAct } from "../acts/reload-resource-completions.act";
import { removeResourceCompletionsAct } from "../acts/remove-resource-completions.act";
import { CompletedResourcesSkeletonLoader } from "../components/completed-resources-skeleton-loader";

function getResourcePreviewUrl(completion: ResourceCompletionDto): string {
  if (completion.type === "document") {
    return `${meta.routes.documents.preview}?id=${completion.resourceId}`;
  }
  if (completion.type === "mindmap") {
    return `${meta.routes.mindmaps.preview}?mindmapId=${completion.resourceId}`;
  }
  // mindmap-node
  const mindmapId = completion.parentId ?? completion.resourceId;
  return `${meta.routes.mindmaps.preview}?mindmapId=${mindmapId}&mindmapNodeId=${completion.resourceId}`;
}

const Content = ({
  errorModal,
  removeConfirmModal,
  removeCompletionsMutation,
  selectedResourceIds,
  toggleSelection,
}: {
  errorModal: ReturnType<typeof useFeature<API4MarkdownError>>;
  removeConfirmModal: ReturnType<typeof useFeature<ResourceCompletionDto[]>>;
  removeCompletionsMutation: ReturnType<typeof useMutation<void>>;
  selectedResourceIds: Set<string>;
  toggleSelection: (resourceId: string) => void;
}) => {
  const state = useResourcesCompletionState();

  const entries = useMemo(() => {
    if (state.is !== "ok") return [];
    const data = rawResourcesCompletionSelector(state);
    return Object.values(data).sort(
      (a, b) => new Date(b.cdate).getTime() - new Date(a.cdate).getTime(),
    );
  }, [state]);

  if (state.is === "idle" || (state.is === "busy" && entries.length === 0)) {
    return (
      <CompletedResourcesSkeletonLoader data-testid="[completed-resources]:loader" />
    );
  }

  if (state.is === "fail") {
    return (
      <Err>
        <Err.Icon>
          <BiError size={80} />
        </Err.Icon>
        <Err.Title>Something went wrong!</Err.Title>
        <Err.Description>{state.error.message}</Err.Description>
        <Err.Action
          title="Retry loading completed items"
          auto
          s={2}
          i={2}
          onClick={() => loadResourceCompletionsAct()}
        >
          Try Again
        </Err.Action>
      </Err>
    );
  }

  if (entries.length === 0) {
    return (
      <Empty id="empty-state-completed">
        <Empty.Icon>
          <BiCheckCircle size={80} />
        </Empty.Icon>
        <Empty.Title id="empty-title-completed">
          No completed items here
        </Empty.Title>
        <Empty.Description aria-describedby="empty-title-completed">
          Complete documents, mindmaps or nodes to see them here
        </Empty.Description>
      </Empty>
    );
  }

  return (
    <>
      {errorModal.is === "on" && (
        <Modal2 onClose={errorModal.off}>
          <Modal2.Header
            title="Error occurred"
            closeButtonTitle="Close error screen"
          />
          <Modal2.Body>
            <Err>
              <Err.Icon>
                <BiError size={80} />
              </Err.Icon>
              <Err.Title>Something went wrong!</Err.Title>
              <Err.Description>{errorModal.data.message}</Err.Description>
            </Err>
          </Modal2.Body>
          <Modal2.Footer className="flex justify-end gap-2">
            <Button i={1} s={2} auto title="Close" onClick={errorModal.off}>
              Close
            </Button>
          </Modal2.Footer>
        </Modal2>
      )}

      {removeConfirmModal.is === "on" && (
        <Modal2 onClose={removeConfirmModal.off}>
          <Modal2.Header
            title="Remove from completed"
            closeButtonTitle="Cancel remove"
          />
          <Modal2.Body>
            <p>
              Are you sure you want to remove{" "}
              <strong>{removeConfirmModal.data.length}</strong> item
              {removeConfirmModal.data.length > 1 ? "s" : ""} from your
              completed list?
            </p>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              You can mark them completed again later from their pages.
            </p>
          </Modal2.Body>
          <Modal2.Footer className="flex gap-3">
            <Button
              i={1}
              s={2}
              auto
              className="flex-1"
              title="Cancel remove"
              onClick={removeConfirmModal.off}
            >
              Cancel
            </Button>
            <Button
              i={2}
              s={2}
              className="flex-1"
              auto
              title="Confirm remove from completed list"
              onClick={() => removeCompletionsMutation.start()}
            >
              Confirm
            </Button>
          </Modal2.Footer>
        </Modal2>
      )}

      <ul className="columns-1 md:columns-2 lg:columns-3 gap-4 [column-fill:_balance] animate-fade-in">
        {entries.map((completion) => {
          const isSelected = selectedResourceIds.has(completion.resourceId);
          const previewUrl = getResourcePreviewUrl(completion);
          const typeLabel = completion.type.replace(/-/g, " ");
          const title = completion.title?.trim() || typeLabel;
          const description = completion.description?.trim();
          const linkClassName =
            "flex flex-col min-w-0 rounded-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:outline-none hover:opacity-90";
          return (
            <li
              key={completion.resourceId}
              className={`break-inside-avoid mb-4 p-4 flex flex-col rounded-lg border ${
                isSelected
                  ? "border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                  : "border-zinc-300 dark:border-zinc-800"
              }`}
            >
              <Link
                to={previewUrl}
                className={linkClassName}
                title={`Open ${title}`}
              >
                <div
                  className="w-full rounded-lg mb-3 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 min-h-[120px]"
                  style={{ maxHeight: "120px" }}
                >
                  <span className="text-2xl font-semibold text-zinc-500 dark:text-zinc-400 uppercase">
                    {typeLabel}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-pretty line-clamp-2 min-w-0">
                  {title}
                </h3>
                {description ? (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-4 min-w-0 mt-1">
                    {description}
                  </p>
                ) : null}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-variant-numeric tabular-nums">
                  {new Date(completion.cdate).toLocaleDateString(undefined, {
                    dateStyle: "medium",
                  })}
                </p>
              </Link>
              <div className="mt-2 flex justify-end">
                <Checkbox
                  checked={isSelected}
                  onChange={() => toggleSelection(completion.resourceId)}
                  aria-label={`Select completed item ${title}`}
                  id={`completed-checkbox-${completion.resourceId}`}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
};

const CompletedResourcesGridContainer = () => {
  const state = useResourcesCompletionState();
  const [selectedResourceIds, setSelectedResourceIds] = useState<Set<string>>(
    new Set(),
  );
  const removeConfirmModal = useFeature<ResourceCompletionDto[]>();
  const errorModal = useFeature<API4MarkdownError>();

  const removeCompletionsMutation = useMutation({
    handler: (signal) => {
      if (removeConfirmModal.is !== "on") {
        throw new Error("No completed items selected to remove");
      }
      const entriesToRemove = removeConfirmModal.data;
      removeConfirmModal.off();
      return removeResourceCompletionsAct(entriesToRemove).catch((err) => {
        if (!signal.aborted) {
          errorModal.on(err);
        }
        throw err;
      });
    },
    onFail: (error) => {
      errorModal.on(error);
    },
  });

  useEffect(() => {
    loadResourceCompletionsAct();
  }, []);

  const entries = useMemo(() => {
    if (state.is !== "ok") return [];
    return Object.values(rawResourcesCompletionSelector(state));
  }, [state]);

  const allSelected =
    entries.length > 0 && selectedResourceIds.size === entries.length;

  const handleToggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedResourceIds(new Set(entries.map((e) => e.resourceId)));
    } else {
      setSelectedResourceIds(new Set());
    }
  };

  const toggleSelection = (resourceId: string) => {
    setSelectedResourceIds((prev) => {
      const next = new Set(prev);
      if (next.has(resourceId)) {
        next.delete(resourceId);
      } else {
        next.add(resourceId);
      }
      return next;
    });
  };

  const handleRemoveSelected = () => {
    const selected = Array.from(selectedResourceIds);
    if (selected.length === 0) return;
    const toRemove = entries.filter((e) => selected.includes(e.resourceId));
    if (toRemove.length > 0) {
      removeConfirmModal.on(toRemove);
    }
  };

  return (
    <div className="max-w-6xl w-full mx-auto animate-fade-in">
      <p className="mb-4 flex gap-1 text-sm justify-center items-center border bg-zinc-200 dark:bg-gray-950 border-zinc-300 dark:border-zinc-800 p-2 rounded-md">
        <BiInfoCircle className="shrink-0" size={24} aria-hidden />
        <span>
          Completed items are saved here. Remove items to unmark them; you can
          mark them completed again from their pages.
        </span>
      </p>
      <header className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-pretty">Completed</h1>
          <div className="flex items-center gap-2">
            <Button
              i={2}
              s={1}
              title="Sync completed items"
              onClick={() => reloadResourceCompletionsAct()}
              disabled={
                state.is === `busy` || removeCompletionsMutation.is === `busy`
              }
              aria-label="Refresh completed items"
            >
              <BiRefresh />
            </Button>
            <Button
              i={2}
              s={1}
              title="Unmark selected"
              onClick={handleRemoveSelected}
              disabled={
                selectedResourceIds.size === 0 ||
                state.is === `busy` ||
                removeCompletionsMutation.is === `busy`
              }
              aria-label="Unmark selected items"
            >
              <BiTrash />
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold font-variant-numeric tabular-nums text-pretty">
            Results: {entries.length}
          </h2>
          <Switch
            checked={allSelected}
            onChange={handleToggleSelectAll}
            disabled={entries.length === 0}
            aria-label="Select all completed items"
            id="select-all-completed-switch"
          />
        </div>
      </header>
      <section className="mt-6" aria-label="Completed items grid">
        <Content
          errorModal={errorModal}
          removeConfirmModal={removeConfirmModal}
          removeCompletionsMutation={removeCompletionsMutation}
          selectedResourceIds={selectedResourceIds}
          toggleSelection={toggleSelection}
        />
      </section>
    </div>
  );
};

export { CompletedResourcesGridContainer };
