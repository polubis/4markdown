import { parseError } from "api-4markdown";
import { useResourceActivityState } from "../store";
import { Atoms, ResourceActivityDto } from "api-4markdown-contracts";
import { mock } from "development-kit/mock";

// Mock data for development
const generateMockActivity = (
  resourceId: Atoms["ResourceId"],
  resourceType: Atoms["ResourceType"],
): ResourceActivityDto[] => {
  const now = new Date();
  const mockAuthor: ResourceActivityDto["authorProfile"] = {
    id: "user_mock_001" as Atoms["UserProfileId"],
    cdate: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
      .toISOString() as Atoms["UTCDate"],
    mdate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      .toISOString() as Atoms["UTCDate"],
    displayName: "John Doe",
    displayNameSlug: "john-doe" as Atoms["Slug"],
    bio: "Software developer passionate about clean code",
    avatar: null,
    githubUrl: "https://github.com/johndoe" as Atoms["Url"],
    linkedInUrl: null,
    twitterUrl: null,
    fbUrl: null,
    blogUrl: null,
  };

  // Return activities ordered from newest to oldest (as backend will return)
  return [
    {
      id: "activity_007" as Atoms["ResourceActivityId"],
      type: "score-changed",
      resourceId,
      resourceType,
      cdate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000)
        .toISOString() as Atoms["UTCDate"],
      authorProfile: mockAuthor,
      previousScore: {
        scoreAverage: 7.5,
        scoreCount: 8,
        scoreValues: [6, 7, 8, 8, 7, 8, 9, 7],
      },
      newScore: {
        scoreAverage: 8.0,
        scoreCount: 9,
        scoreValues: [6, 7, 8, 8, 7, 8, 9, 7, 9],
      },
    },
    {
      id: "activity_006" as Atoms["ResourceActivityId"],
      type: "rating-changed",
      resourceId,
      resourceType,
      cdate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        .toISOString() as Atoms["UTCDate"],
      authorProfile: mockAuthor,
      previousRating: {
        ugly: 0,
        bad: 1,
        decent: 2,
        good: 3,
        perfect: 1,
      },
      newRating: {
        ugly: 0,
        bad: 1,
        decent: 2,
        good: 4,
        perfect: 2,
      },
    },
    {
      id: "activity_005" as Atoms["ResourceActivityId"],
      type: "comment-added",
      resourceId,
      resourceType,
      cdate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000)
        .toISOString() as Atoms["UTCDate"],
      authorProfile: mockAuthor,
      comment: {
        id: "comment_001" as Atoms["UserProfileCommentId"],
        ownerProfile: mockAuthor,
        cdate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000)
          .toISOString() as Atoms["UTCDate"],
        mdate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000)
          .toISOString() as Atoms["UTCDate"],
        content: "This is a great resource! Very helpful content.",
        ugly: 0,
        bad: 0,
        decent: 0,
        good: 0,
        perfect: 0,
      },
    },
    {
      id: "activity_004" as Atoms["ResourceActivityId"],
      type: "metadata-updated",
      resourceId,
      resourceType,
      cdate: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000)
        .toISOString() as Atoms["UTCDate"],
      authorProfile: mockAuthor,
      previousMeta: {
        tags: [],
        description: null,
      },
      newMeta: {
        tags: ["tutorial", "guide", "documentation"],
        description: "A comprehensive guide to getting started",
      },
    },
    {
      id: "activity_003" as Atoms["ResourceActivityId"],
      type: "visibility-changed",
      resourceId,
      resourceType,
      cdate: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000)
        .toISOString() as Atoms["UTCDate"],
      authorProfile: mockAuthor,
      previousVisibility: "private",
      newVisibility: "public",
    },
    {
      id: "activity_002" as Atoms["ResourceActivityId"],
      type: "content-changed",
      resourceId,
      resourceType,
      previousContent: "Initial content",
      newContent: "Updated content with improvements",
      cdate: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000)
        .toISOString() as Atoms["UTCDate"],
      authorProfile: mockAuthor,
    },
    {
      id: "activity_001" as Atoms["ResourceActivityId"],
      type: "created",
      resourceId,
      resourceType,
      cdate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        .toISOString() as Atoms["UTCDate"],
      authorProfile: mockAuthor,
    },
  ];
};

const loadResourceActivityAct = async (
  resourceId: Atoms["ResourceId"],
  resourceType: Atoms["ResourceType"],
): Promise<void> => {
  try {
    useResourceActivityState.swap({ is: `busy` });

    const mockActivity = generateMockActivity(resourceId, resourceType);

    // Mock implementation using development-kit/mock utility
    const mockCall = mock({ delay: 0.8 })(mockActivity);
    const activity = await mockCall({ resourceId, resourceType });

    useResourceActivityState.swap({
      is: `ok`,
      data: activity,
    });

    // Original API call implementation (commented out)
    // import { getAPI } from "api-4markdown";
    // import { API4MarkdownContractKey } from "api-4markdown-contracts";
    // const key: API4MarkdownContractKey = `getResourceActivity`;
    // const activity = await getAPI().call(key)({
    //   resourceId,
    //   resourceType,
    // });
    // useResourceActivityState.swap({
    //   is: `ok`,
    //   data: activity,
    // });
  } catch (error) {
    useResourceActivityState.swap({
      is: `fail`,
      error: parseError(error),
    });
  }
};

export { loadResourceActivityAct };
