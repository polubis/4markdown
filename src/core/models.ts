import { type CacheVersion } from "api-4markdown-contracts";
import { type meta } from "../../meta";
import { type Prettify } from "development-kit/utility-types";

export type SiteMetadata = Prettify<
  typeof meta & {
    buildStamp: CacheVersion;
  }
>;
