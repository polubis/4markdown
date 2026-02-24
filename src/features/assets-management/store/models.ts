import { ImageDto, API4MarkdownError } from "api-4markdown-contracts";

type Asset = ImageDto;

type AssetsManagementState = {
  idle: boolean;
  busy: boolean;
  error: API4MarkdownError | null;
  assets: Asset[];
  selectedAssetIds: Set<string>;
};

export type { AssetsManagementState };
