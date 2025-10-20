import { AccessGroupId, Etag, UserProfileId, UTCDate } from "../atoms";

type AccessGroupDto = {
  id: AccessGroupId;
  cdate: UTCDate;
  etag: Etag;
  mdate: UTCDate;
  name: string;
  description: string | null;
  members: UserProfileId[];
};

export type { AccessGroupDto };
