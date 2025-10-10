import { AccessGroupId, Etag, UTCDate } from "../atoms";

type AccessGroupDto = {
  id: AccessGroupId;
  cdate: UTCDate;
  etag: Etag;
  mdate: UTCDate;
  name: string;
  description: string | null;
};

export type { AccessGroupDto };
