import React from "react";
import { BiError, BiImage, BiInfoCircle, BiTrash } from "react-icons/bi";
import { Button } from "design-system/button";
import { Checkbox } from "design-system/checkbox";
import { Switch } from "design-system/switch";
import { ImageUploaderContainer } from "features/creator/containers/image-uploader.container";
import { useAssetsManagementStore } from "../store";
import { getYourAssetsAct } from "../acts/get-your-assets.act";
import { removeAssetsAct } from "../acts/remove-assets.act";
import {
  toggleAssetSelectionAction,
  selectAllAssetsAction,
  deselectAllAssetsAction,
} from "../store/actions";
import { AssetsSkeletonLoader } from "../components/assets-skeleton-loader";
import { Empty } from "design-system/empty";
import { Err } from "design-system/err";
import { Modal2 } from "design-system/modal2";
import { useFeature } from "@greenonsoftware/react-kit";
import { useMutation } from "core/use-mutation";
import { API4MarkdownError } from "api-4markdown-contracts";

const Content = ({
  removeConfirmModal,
}: {
  removeConfirmModal: ReturnType<typeof useFeature<string[]>>;
}) => {
  const { assets, idle, busy, error, selectedAssetIds } =
    useAssetsManagementStore();

  const errorModal = useFeature<API4MarkdownError>();

  const removeAssetsMutation = useMutation({
    handler: (signal) => {
      if (removeConfirmModal.is !== "on") {
        throw new Error("No assets selected to remove");
      }

      const assetIdsToRemove = removeConfirmModal.data;
      removeConfirmModal.off();

      return removeAssetsAct(assetIdsToRemove).catch((err) => {
        if (!signal.aborted) {
          // On error, we could restore the assets, but for simplicity we'll just show error
        }
        throw err;
      });
    },
    onFail: (error) => {
      errorModal.on(error);
    },
  });

  const sortedAssets = React.useMemo(() => {
    if (assets.length === 0) {
      return assets;
    }

    return [...assets].sort((a, b) => {
      const aCdate = a.cdate ?? "";
      const bCdate = b.cdate ?? "";

      if (aCdate === bCdate) return 0;
      // Newest first
      return aCdate < bCdate ? 1 : -1;
    });
  }, [assets]);

  if (idle || (busy && sortedAssets.length === 0)) {
    return <AssetsSkeletonLoader data-testid="[assets]:loader" />;
  }

  if (error) {
    return (
      <Err>
        <Err.Icon>
          <BiError size={80} />
        </Err.Icon>
        <Err.Title>Something went wrong!</Err.Title>
        <Err.Description>{error.message}</Err.Description>
        <Err.Action
          title="Retry loading assets"
          auto
          s={2}
          i={2}
          onClick={() => getYourAssetsAct()}
        >
          Try Again
        </Err.Action>
      </Err>
    );
  }

  if (sortedAssets.length === 0) {
    return (
      <Empty id="empty-state">
        <Empty.Icon>
          <BiImage size={80} />
        </Empty.Icon>
        <Empty.Title id="empty-title">No Assets here yet!</Empty.Title>
        <Empty.Description aria-describedby="empty-title">
          Upload images to see them here
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
            title="Delete Assets"
            closeButtonTitle="Cancel delete assets"
          />
          <Modal2.Body>
            <p>
              Are you sure you want to delete{" "}
              <strong>{removeConfirmModal.data.length}</strong> asset
              {removeConfirmModal.data.length > 1 ? "s" : ""}?
            </p>
            <p className="mt-2">
              This action cannot be undone. The selected assets will be
              permanently removed.
            </p>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Keep in mind that some of these assets may be used in documents or
              mindmaps you&apos;ve created. We&apos;re not checking that to save
              some planet resources ;)
            </p>
          </Modal2.Body>
          <Modal2.Footer className="flex gap-3">
            <Button
              i={1}
              s={2}
              auto
              className="flex-1"
              title="Cancel delete assets"
              onClick={removeConfirmModal.off}
            >
              Cancel
            </Button>
            <Button
              i={2}
              s={2}
              className="flex-1"
              auto
              title="Confirm delete assets"
              onClick={() => removeAssetsMutation.start()}
            >
              Confirm
            </Button>
          </Modal2.Footer>
        </Modal2>
      )}

      <ul className="columns-1 md:columns-2 lg:columns-3 gap-4 [column-fill:_balance] animate-fade-in">
        {sortedAssets.map((asset) => {
          const isSelected = selectedAssetIds.has(asset.id);
          return (
            <li
              key={asset.id}
              className={`break-inside-avoid mb-4 p-4 flex flex-col rounded-lg border ${
                isSelected
                  ? "border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                  : "border-zinc-300 dark:border-zinc-800"
              }`}
            >
              <img
                src={asset.url}
                alt={`Asset ${asset.id}`}
                className="w-full h-auto rounded-lg mb-3 object-cover min-w-0"
                style={{ maxHeight: "300px" }}
                width={400}
                height={300}
                loading="lazy"
                decoding="async"
              />
              <div className="flex flex-col gap-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {asset.extension.toUpperCase()}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {asset.contentType}
                </p>
              </div>
              <div className="mt-2 flex justify-end">
                <Checkbox
                  checked={isSelected}
                  onChange={() => toggleAssetSelectionAction(asset.id)}
                  aria-label={`Select asset ${asset.id}`}
                  id={`asset-checkbox-${asset.id}`}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
};

const AssetsListContainer = () => {
  const { assets, selectedAssetIds, busy } = useAssetsManagementStore();
  const removeConfirmModal = useFeature<string[]>();

  React.useEffect(() => {
    getYourAssetsAct();
  }, []);

  const allSelected =
    assets.length > 0 && selectedAssetIds.size === assets.length;

  const handleToggleSelectAll = (checked: boolean) => {
    if (checked) {
      selectAllAssetsAction();
    } else {
      deselectAllAssetsAction();
    }
  };

  const handleRemoveSelected = () => {
    const selectedIds = Array.from(selectedAssetIds);
    if (selectedIds.length > 0) {
      removeConfirmModal.on(selectedIds);
    }
  };

  return (
    <div className="max-w-6xl w-full mx-auto animate-fade-in">
      <p className="mb-4 flex gap-1 text-sm justify-center items-center border bg-zinc-200 dark:bg-gray-950 border-zinc-300 dark:border-zinc-800 p-2 rounded-md">
        <BiInfoCircle className="shrink-0" size={24} aria-hidden />
        <span>
          Uploaded assets are visible to everyone by default when you share a
          link to them. They can be shared across many articles.
        </span>
      </p>
      <header className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-pretty">Your Assets</h1>
          <div className="flex items-center gap-3">
            <ImageUploaderContainer i={2} s={1} />
            <Button
              i={2}
              s={1}
              title="Delete selected assets"
              onClick={handleRemoveSelected}
              disabled={selectedAssetIds.size === 0 || busy}
              aria-label="Delete selected assets"
            >
              <BiTrash />
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold font-variant-numeric tabular-nums text-pretty">
            Results: {assets.length}
          </h2>
          <Switch
            checked={allSelected}
            onChange={handleToggleSelectAll}
            disabled={assets.length === 0}
            aria-label="Select all assets"
            id="select-all-assets-switch"
          />
        </div>
      </header>
      <section className="mt-6" aria-label="Asset grid">
        <Content removeConfirmModal={removeConfirmModal} />
      </section>
    </div>
  );
};

export { AssetsListContainer };
