import { Button } from "design-system/button";
import React from "react";
import { BiPencil } from "react-icons/bi";
import { VisibilityIcon } from "./visibility-icon";
import { c } from "design-system/c";
import { navigate } from "gatsby";
import { formatDistance } from "date-fns";
import { Atoms } from "api-4markdown-contracts";

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
  return (
    <>
      <div className="relative flex flex-col border-zinc-300 dark:border-zinc-800 rounded-lg border-2 p-4">
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
          <h6 className="text-2xl">{name}</h6>
        </div>
        {description && <p className="mt-1.5 line-clamp-3">{description}</p>}
        {tags && tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="flex text-sm font-medium uppercase w-fit rounded-md bg-slate-200 dark:bg-slate-800 py-1 px-1.5"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-2 flex flex-col gap-1 border-zinc-300 dark:border-zinc-800 rounded-lg border-2 p-4">
        <p>
          ID:{` `}
          <strong>{id}</strong>
        </p>
        <p>
          Created:{` `}
          <strong>
            {formatDistance(new Date().toISOString(), createdAt)} ago
          </strong>
        </p>
        <p>
          Edited:{` `}
          <strong>
            {formatDistance(new Date().toISOString(), editedAt)} ago
          </strong>
        </p>
        {visibility === "manual" && (
          <p>
            Groups with access:{` `}
            <strong>{sharedForGroups?.length ?? 0}</strong>
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 mt-4 justify-end">
        {visibility !== "private" && previewUrl && (
          <Button
            auto
            title={`${type} preview`}
            s={1}
            i={2}
            onClick={() => navigate(previewUrl)}
          >
            Preview
          </Button>
        )}
        {visibility === "permanent" && staticUrl && (
          <Button auto s={1} i={2} onClick={() => navigate(staticUrl)}>
            URL
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
