import { Button } from "design-system/button";
import React from "react";
import { BiPencil } from "react-icons/bi";
import { VisibilityIcon } from "./visibility-icon";
import { c } from "design-system/c";
import { navigate } from "gatsby";
import { formatDistance } from "date-fns";
import { Atoms } from "api-4markdown-contracts";
import { meta } from "../../meta";
import { useCopy } from "development-kit/use-copy";

type ResourceDetailsProps = {
  visibility: Atoms["ResourceVisibility"];
  name: string;
  type: "Document" | "Mindmap";
  id: string;
  previewUrl?: string;
  staticUrl?: string;
  tags?: string[];
  createdAt: string;
  editedAt: string;
  description?: string;
  sharedForGroups?: Atoms["AccessGroupId"][];
  onAccessEdit: () => void;
};

const toFullUrl = (path: string): string =>
  meta.siteUrl + (path.startsWith("/") ? path : `/${path}`);

const ResourceDetails = ({
  name,
  id,
  tags,
  visibility,
  type,
  previewUrl,
  staticUrl,
  createdAt,
  editedAt,
  description,
  sharedForGroups,
  onAccessEdit,
}: ResourceDetailsProps) => {
  const [idCopyState, copyId] = useCopy();
  const [descriptionCopyState, copyDescription] = useCopy();
  const [tagsCopyState, copyTags] = useCopy();
  const [staticCopyState, copyStatic] = useCopy();
  const [dynamicCopyState, copyDynamic] = useCopy();

  // URL display and copy depend on resource visibility:
  // - permanent → both static URL and dynamic (preview) URL
  // - public or manual → dynamic (preview) URL only
  // - private → neither
  const fullStaticUrl =
    visibility === "permanent" && staticUrl ? toFullUrl(staticUrl) : undefined;
  const fullDynamicUrl =
    (visibility === "permanent" ||
      visibility === "public" ||
      visibility === "manual") &&
    previewUrl
      ? toFullUrl(previewUrl)
      : undefined;

  const trimmedId = id.trim();
  const trimmedDescription = description?.trim() || "—";
  const descriptionToCopy =
    trimmedDescription === "—" ? "" : trimmedDescription;
  const tagsText = tags && tags.length > 0 ? tags.join(", ") : "";

  return (
    <>
      <div className="relative flex flex-col">
        <div>
          <strong
            className={c(
              `capitalize inline-flex items-center gap-1`,
              visibility === "private"
                ? "text-gray-600 dark:text-gray-400"
                : "text-green-700 dark:text-green-600",
            )}
          >
            <VisibilityIcon className="size-6" visibility={visibility} />
            {visibility}
          </strong>
          <h6 className="text-lg">{name}</h6>
        </div>
        {descriptionToCopy && (
          <div className="mt-3 min-w-0">
            <span className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">
              Description
            </span>
            <button
              type="button"
              onClick={() => copyDescription(descriptionToCopy)}
              title="Click to copy"
              className={c(
                "text-left w-full rounded px-2 py-1 -mx-2 -my-1",
                "text-sm line-clamp-3 block",
                "text-zinc-700 dark:text-zinc-300",
                "hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer",
                "border border-transparent hover:border-zinc-300 dark:hover:border-zinc-600",
              )}
            >
              {trimmedDescription}
            </button>
            {descriptionCopyState.is === "copied" && (
              <span className="text-xs text-green-600 dark:text-green-500 mt-0.5 block">
                Copied!
              </span>
            )}
          </div>
        )}
        {tagsText && (
          <div className="mt-3 min-w-0">
            <span className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">
              Tags
            </span>
            <button
              type="button"
              onClick={() => copyTags(tagsText)}
              title="Click to copy"
              className={c(
                "text-left w-full rounded px-2 py-1 -mx-2 -my-1",
                "text-sm block text-zinc-700 dark:text-zinc-300",
                "hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer",
                "border border-transparent hover:border-zinc-300 dark:hover:border-zinc-600",
              )}
            >
              {tagsText}
            </button>
            {tagsCopyState.is === "copied" && (
              <span className="text-xs text-green-600 dark:text-green-500 mt-0.5 block">
                Copied!
              </span>
            )}
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-3">
          <div className="min-w-0">
            <span className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">
              ID
            </span>
            <button
              type="button"
              onClick={() => copyId(trimmedId)}
              title="Click to copy"
              className={c(
                "text-left w-full rounded px-2 py-1 -mx-2 -my-1",
                "text-sm font-mono break-all block",
                "hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer",
                "border border-transparent hover:border-zinc-300 dark:hover:border-zinc-600",
              )}
            >
              {trimmedId}
            </button>
            {idCopyState.is === "copied" && (
              <span className="text-xs text-green-600 dark:text-green-500 mt-0.5 block">
                Copied!
              </span>
            )}
          </div>
          <div className="min-w-0">
            <span className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">
              Created
            </span>
            <strong className="block">
              {formatDistance(new Date().toISOString(), createdAt)} ago
            </strong>
          </div>
          <div className="min-w-0">
            <span className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">
              Edited
            </span>
            <strong className="block">
              {formatDistance(new Date().toISOString(), editedAt)} ago
            </strong>
          </div>
          {visibility === "manual" && (
            <div className="min-w-0">
              <span className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                Groups with access
              </span>
              <strong className="block">{sharedForGroups?.length ?? 0}</strong>
            </div>
          )}
          {fullStaticUrl && (
            <div className="min-w-0 flex-1 basis-64">
              <span className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                Static URL
              </span>
              <button
                type="button"
                onClick={() => copyStatic(fullStaticUrl)}
                title="Click to copy"
                className={c(
                  "text-left w-full rounded px-2 py-1 -mx-2 -my-1",
                  "text-sm font-mono truncate block",
                  "hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer",
                  "border border-transparent hover:border-zinc-300 dark:hover:border-zinc-600",
                )}
              >
                {fullStaticUrl}
              </button>
              {staticCopyState.is === "copied" && (
                <span className="text-xs text-green-600 dark:text-green-500 mt-0.5 block">
                  Copied!
                </span>
              )}
            </div>
          )}
          {fullDynamicUrl && (
            <div className="min-w-0 flex-1 basis-64">
              <span className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                Dynamic URL
              </span>
              <button
                type="button"
                onClick={() => copyDynamic(fullDynamicUrl)}
                title="Click to copy"
                className={c(
                  "text-left w-full rounded px-2 py-1 -mx-2 -my-1",
                  "text-sm font-mono truncate block",
                  "hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer",
                  "border border-transparent hover:border-zinc-300 dark:hover:border-zinc-600",
                )}
              >
                {fullDynamicUrl}
              </button>
              {dynamicCopyState.is === "copied" && (
                <span className="text-xs text-green-600 dark:text-green-500 mt-0.5 block">
                  Copied!
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 justify-end">
        {fullStaticUrl && staticUrl && (
          <Button
            auto
            title="Open static URL"
            s={1}
            i={2}
            onClick={() => navigate(staticUrl)}
          >
            Static URL
          </Button>
        )}
        {fullDynamicUrl && previewUrl && (
          <Button
            auto
            title="Open dynamic URL"
            s={1}
            i={2}
            onClick={() => navigate(previewUrl)}
          >
            Dynamic URL
          </Button>
        )}
        {visibility === "manual" && (
          <Button auto s={1} i={2} onClick={onAccessEdit}>
            <BiPencil />
            Edit Access
          </Button>
        )}
      </div>
    </>
  );
};

export { ResourceDetails };
