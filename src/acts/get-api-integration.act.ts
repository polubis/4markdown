import type { API4MarkdownDto } from "api-4markdown-contracts";
import { mock } from "development-kit/mock";

const mockedApiIntegration: API4MarkdownDto<"getApiIntegration"> = {
  plan: "Free",
  defaultKeyDurationDays: 30,
  availableKeyDurationsDays: [1, 7, 30, 90, 365],
  endpoints: [
    {
      method: "GET",
      path: "/v1/mindmaps",
      description: "List available mindmaps for the authorized account",
      callsUsed: 0,
      dailyLimit: 100,
    },
    {
      method: "GET",
      path: "/v1/mindmaps/{id}",
      description: "Get full details for a specific mindmap",
      callsUsed: 0,
      dailyLimit: 100,
    },
    {
      method: "POST",
      path: "/v1/mindmaps",
      description: "Create a new mindmap from your integration",
      callsUsed: 0,
      dailyLimit: 100,
    },
    {
      method: "POST",
      path: "/v1/user-profile/comments",
      description: "Create profile comments from an external app",
      callsUsed: 0,
      dailyLimit: 100,
    },
  ],
};

const getApiIntegrationAct = async (): Promise<
  API4MarkdownDto<"getApiIntegration">
> => mock({ delay: 0.25 })(mockedApiIntegration)(undefined);

export { getApiIntegrationAct };
export { mockedApiIntegration };
