import { getAPI, parseError } from "api-4markdown";
import { ImageDto } from "api-4markdown-contracts";
import { useAssetsManagementStore } from "../store";
import { setAssetsAction, setPaginationAction } from "../store/actions";
import { generateMockAssets } from "../mocks/generate-mock-assets";

const getYourAssetsAct = async (
  cursor: Pick<ImageDto, "id"> | null = null,
): Promise<void> => {
  try {
    useAssetsManagementStore.setState({
      busy: true,
      idle: false,
      error: null,
    });

    // MOCK IMPLEMENTATION - Comment out when real API is ready
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

    const startIndex = cursor
      ? parseInt(cursor.id.replace("mock-asset-", ""), 10) + 1
      : 0;
    const limit = 20;
    const mockAssets = generateMockAssets(limit, startIndex);
    const hasMore = startIndex + limit < 100; // Simulate 100 total assets
    const nextCursor = hasMore
      ? ({ id: mockAssets[mockAssets.length - 1].id } as Pick<ImageDto, "id">)
      : null;

    const data = {
      assets: mockAssets,
      hasMore,
      nextCursor,
    };

    // REAL API CALL - Uncomment when backend is ready
    // const data = await getAPI().call(`getYourAssets`)({
    //   limit: 20,
    //   cursor,
    // });

    if (cursor === null) {
      setAssetsAction(data.assets);
    } else {
      useAssetsManagementStore.setState((prevState) => ({
        assets: [...prevState.assets, ...data.assets],
      }));
    }

    setPaginationAction(data.hasMore, data.nextCursor);

    useAssetsManagementStore.setState({
      busy: false,
    });
  } catch (error: unknown) {
    useAssetsManagementStore.setState({
      busy: false,
      error: parseError(error),
    });
  }
};

export { getYourAssetsAct };
