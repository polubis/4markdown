import { Brand } from "development-kit/utility-types";

export type Atoms = {
  UTCDate: Brand<string, `UTCDate`>;
  Etag: Brand<string, `Etag`>;
  AccessGroupId: Brand<string, `AccessGroupId`>;
  UserProfileId: Brand<string, `UserProfileId`>;
};

export type AccessGroupDto = {
  id: Atoms["AccessGroupId"];
  cdate: Atoms["UTCDate"];
  etag: Atoms["Etag"];
  mdate: Atoms["UTCDate"];
  name: string;
  description: string | null;
  members: Atoms["UserProfileId"][];
};
