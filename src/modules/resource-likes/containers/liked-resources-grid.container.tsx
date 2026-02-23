import React, { useEffect, useMemo, useState } from "react";
import { Link } from "gatsby";
import {
  BiError,
  BiInfoCircle,
  BiRefresh,
  BiStar,
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
import { API4MarkdownError, ResourceLikeDto } from "api-4markdown-contracts";
import { meta } from "../../../../meta";
import { useResourcesLikeState } from "../store";
import { rawResourcesLikeSelector } from "../store/selectors";
import { loadResourceLikesAct } from "../acts/load-resource-likes.act";
import { reloadResourceLikesAct } from "../acts/reload-resource-likes.act";
import { removeResourceLikesAct } from "../acts/remove-resource-likes.act";
import { LikedResourcesSkeletonLoader } from "../components/liked-resources-skeleton-loader";

function getResourcePreviewUrl(like: ResourceLikeDto): string {
  if (like.type === "document") {
    return `${meta.routes.documents.preview}?id=${like.resourceId}`;
  }
  if (like.type === "mindmap") {
    return `${meta.routes.mindmaps.preview}?mindmapId=${like.resourceId}`;
  }
  // mindmap-node
  const mindmapId = like.parentId ?? like.resourceId;
  return `${meta.routes.mindmaps.preview}?mindmapId=${mindmapId}&mindmapNodeId=${like.resourceId}`;
}

const Content = ({
  errorModal,
  removeConfirmModal,
  removeLikesMutation,
  selectedResourceIds,
  toggleSelection,
}: {
  errorModal: ReturnType<typeof useFeature<API4MarkdownError>>;
  removeConfirmModal: ReturnType<typeof useFeature<ResourceLikeDto[]>>;
  removeLikesMutation: ReturnType<typeof useMutation<void>>;
  selectedResourceIds: Set<string>;
  toggleSelection: (resourceId: string) => void;
}) => {
  const state = useResourcesLikeState();

  const entries = useMemo(() => {
    if (state.is !== "ok") return [];
    const data = rawResourcesLikeSelector(state);
    return Object.values(data).sort(
      (a, b) => new Date(b.cdate).getTime() - new Date(a.cdate).getTime(),
    );
  }, [state]);

  if (state.is === "idle" || (state.is === "busy" && entries.length === 0)) {
    return (
      <LikedResourcesSkeletonLoader data-testid="[liked-resources]:loader" />
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
          title="Retry loading starred items"
          auto
          s={2}
          i={2}
          onClick={() => loadResourceLikesAct()}
        >
          Try Again
        </Err.Action>
      </Err>
    );
  }

  if (entries.length === 0) {
    return (
      <Empty id="empty-state-liked">
        <Empty.Icon>
          <BiStar size={80} />
        </Empty.Icon>
        <Empty.Title id="empty-title-liked">No starred items here</Empty.Title>
        <Empty.Description aria-describedby="empty-title-liked">
          Star documents, mindmaps or nodes to see them here
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
            title="Remove from starred"
            closeButtonTitle="Cancel remove"
          />
          <Modal2.Body>
            <p>
              Are you sure you want to remove{" "}
              <strong>{removeConfirmModal.data.length}</strong> item
              {removeConfirmModal.data.length > 1 ? "s" : ""} from your starred
              list?
            </p>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              You can star them again later from their pages.
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
              title="Confirm remove from starred"
              onClick={() => removeLikesMutation.start()}
            >
              Confirm
            </Button>
          </Modal2.Footer>
        </Modal2>
      )}

      <ul className="columns-1 md:columns-2 lg:columns-3 gap-4 [column-fill:_balance] animate-fade-in">
        {entries.map((like) => {
          const isSelected = selectedResourceIds.has(like.resourceId);
          const previewUrl = getResourcePreviewUrl(like);
          return (
            <li
              key={like.resourceId}
              className={`break-inside-avoid mb-4 p-4 flex flex-col rounded-lg border ${
                isSelected
                  ? "border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                  : "border-zinc-300 dark:border-zinc-800"
              }`}
            >
              <Link
                to={previewUrl}
                className="flex flex-col min-w-0 rounded-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:outline-none hover:opacity-90"
                title={`Open ${like.title}`}
              >
                <div
                  className="w-full rounded-lg mb-3 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 min-h-[120px]"
                  style={{ maxHeight: "120px" }}
                >
                  <span className="text-2xl font-semibold text-zinc-500 dark:text-zinc-400 uppercase">
                    {like.type.replace(/-/g, " ")}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-pretty line-clamp-2 min-w-0">
                  {like.title}
                </h3>
                {like.description?.trim() ? (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-4 min-w-0 mt-1">
                    {like.description}
                  </p>
                ) : null}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-variant-numeric tabular-nums">
                  {new Date(like.cdate).toLocaleDateString(undefined, {
                    dateStyle: "medium",
                  })}
                </p>
              </Link>
              <div className="mt-2 flex justify-end">
                <Checkbox
                  checked={isSelected}
                  onChange={() => toggleSelection(like.resourceId)}
                  aria-label={`Select starred item ${like.title}`}
                  id={`liked-checkbox-${like.resourceId}`}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
};

const LikedResourcesGridContainer = () => {
  const state = useResourcesLikeState();
  const [selectedResourceIds, setSelectedResourceIds] = useState<Set<string>>(
    new Set(),
  );
  const removeConfirmModal = useFeature<ResourceLikeDto[]>();
  const errorModal = useFeature<API4MarkdownError>();

  const removeLikesMutation = useMutation({
    handler: (signal) => {
      if (removeConfirmModal.is !== "on") {
        throw new Error("No starred items selected to remove");
      }
      const entriesToRemove = removeConfirmModal.data;
      removeConfirmModal.off();
      return removeResourceLikesAct(entriesToRemove).catch((err) => {
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
    loadResourceLikesAct();
  }, []);

  const entries = useMemo(() => {
    if (state.is !== "ok") return [];
    return Object.values(rawResourcesLikeSelector(state));
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
          Starred items are saved here. Remove items to unstar them; you can
          star them again from their pages.
        </span>
      </p>
      <header className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-pretty">Starred</h1>
          <div className="flex items-center gap-2">
            <Button
              i={2}
              s={1}
              title="Sync starred items"
              onClick={() => reloadResourceLikesAct()}
              disabled={
                state.is === `busy` || removeLikesMutation.is === `busy`
              }
              aria-label="Refresh starred items"
            >
              <BiRefresh />
            </Button>
            <Button
              i={2}
              s={1}
              title="Unstar selected"
              onClick={handleRemoveSelected}
              disabled={
                selectedResourceIds.size === 0 ||
                state.is === `busy` ||
                removeLikesMutation.is === `busy`
              }
              aria-label="Unstar selected items"
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
            aria-label="Select all starred items"
            id="select-all-liked-switch"
          />
        </div>
      </header>
      <section className="mt-6" aria-label="Starred items grid">
        <Content
          errorModal={errorModal}
          removeConfirmModal={removeConfirmModal}
          removeLikesMutation={removeLikesMutation}
          selectedResourceIds={selectedResourceIds}
          toggleSelection={toggleSelection}
        />
      </section>
    </div>
  );
};

export { LikedResourcesGridContainer };
