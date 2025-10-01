import { parseError } from "api-4markdown";
import { API4MarkdownDto, UserProfileId } from "api-4markdown-contracts";
import { mock } from "development-kit/mock";
import { AsyncResult } from "development-kit/utility-types";

const getResourceAccessGroupAct = async (): AsyncResult<
  API4MarkdownDto<"getResourceAccessGroups">
> => {
  try {
    const res = await mock({
      delay: 0,
      errorFactor: 0.5,
      error: () => new Error(`Test error`),
    })({
      userProfilesAccess: [
        {
          githubUrl: "https://github.com/polubis",
          linkedInUrl:
            "https://www.linkedin.com/in/adrian-po%C5%82ubi%C5%84ski-281ab2172/",
          cdate: "2024-05-14T05:39:09.032Z",
          mdate: "2024-07-09T10:36:24.149Z",
          displayName: "praca_praca",
          blogUrl: "https://greenonsoftware.com/",
          twitterUrl: "https://github.com",
          email: "praca_praca@gmail.com",
          fbUrl: "https://www.facebook.com/groups/1472987149805006/",
          bio: "👋 Hi there! My name is Adrian, and I've been programming for almost 7 years 💻. I love TDD, monorepo, AI, design patterns, architectural patterns, and all aspects related to creating modern and scalable solutions 🧠.",
          avatar: {
            md: {
              ext: "webp",
              src: "https://firebasestorage.googleapis.com/v0/b/greenonsoftware-dev-api.appspot.com/o/5vHPGeTv26Oj574o1RRjweB6nx03%2Favatars%2Fmd?alt=media",
              w: 64,
              h: 64,
              id: "4154ad6c-5177-410b-862e-6d25fb324238",
            },
            tn: {
              ext: "webp",
              src: "https://firebasestorage.googleapis.com/v0/b/greenonsoftware-dev-api.appspot.com/o/5vHPGeTv26Oj574o1RRjweB6nx03%2Favatars%2Ftn?alt=media",
              w: 24,
              h: 24,
              id: "01588981-9454-4d0e-b763-5b3e19e1212c",
            },
            sm: {
              ext: "webp",
              src: "https://firebasestorage.googleapis.com/v0/b/greenonsoftware-dev-api.appspot.com/o/5vHPGeTv26Oj574o1RRjweB6nx03%2Favatars%2Fsm?alt=media",
              w: 32,
              h: 32,
              id: "29f757ef-e65e-4c16-b468-9cc75af9a7b5",
            },
            lg: {
              ext: "webp",
              src: "https://firebasestorage.googleapis.com/v0/b/greenonsoftware-dev-api.appspot.com/o/5vHPGeTv26Oj574o1RRjweB6nx03%2Favatars%2Flg?alt=media",
              w: 100,
              h: 100,
              id: "8e8b9fb0-11bb-4bc0-ae74-8a142e8f9758",
            },
          },
          id: "90439c62-2b82-4288-9695-7f011839da68" as UserProfileId,
          displayNameSlug: "praca-praca",
        },
      ],
    })(null);

    return {
      is: `ok`,
      data: {
        userProfiles: [
          ...res.userProfilesAccess,
          ...res.userProfilesAccess,
          ...res.userProfilesAccess,
        ],
      },
    };
  } catch (error) {
    const err = parseError(error);

    return { is: `fail`, error: err };
  }
};

export { getResourceAccessGroupAct };
