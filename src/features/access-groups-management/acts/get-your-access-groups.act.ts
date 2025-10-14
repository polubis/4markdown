import { getAPI, parseError } from "api-4markdown";
import { useAccessGroupsManagementStore } from "../store";

const getYourAccessGroupsAct = async (): Promise<void> => {
  try {
    useAccessGroupsManagementStore.setState({
      busy: true,
      idle: false,
      error: null,
    });

    const data = await getAPI().call(`getYourAccessGroups`)({
      limit: 10,
      cursor: null,
    });
    useAccessGroupsManagementStore.setState({
      busy: false,
      accessGroups: data.accessGroups,
    });

    // useAccessGroupsManagementStore.setState({
    //   busy: false,
    //   accessGroups: [
    //     {
    //       id: "eed28367-589e-428b-a43f-a1deea7dc53b",
    //       cdate: "2025-10-10T13:30:54.072Z",
    //       description:
    //         "dasd as asddasd as asddasd as asddasd as asd dasd as asd a asd s asd sadsa dsa asd assad dasdsad",
    //       mdate: "2025-10-10T13:30:54.072Z",
    //       name: "valid_group_name",
    //       etag: "c00fea8e-4ebf-4bae-86f7-d4c1ad59dc6e",
    //     },
    //     {
    //       id: "d53b6c8c-52fe-4080-801c-45db4d2c369e",
    //       cdate: "2025-10-10T13:14:55.206Z",
    //       description: "dasda sdasasd asdsaasd",
    //       mdate: "2025-10-10T13:14:55.206Z",
    //       name: "xdadsadadasd",
    //       etag: "5e4ccff9-c62f-41a6-8dd5-6773f8e6f94b",
    //     },
    //     {
    //       id: "f715cafb-5278-4a43-96a4-e7b7f84ca657",
    //       cdate: "2025-10-10T13:14:01.216Z",
    //       description: "asdasdasdas asd sasasad sasa",
    //       mdate: "2025-10-10T13:14:01.216Z",
    //       name: "dasdasd",
    //       etag: "3b63e038-2d8e-4536-9535-3eff46fd9e99",
    //     },
    //     {
    //       id: "f72b3c87-87fd-4631-ac12-7b9f5a96de36",
    //       cdate: "2025-10-10T13:12:40.737Z",
    //       description: "dasdadaasdasdasd adas",
    //       mdate: "2025-10-10T13:12:40.737Z",
    //       name: "dasdasd",
    //       etag: "b9431298-4d58-44fe-861a-04db49dc0938",
    //     },
    //     {
    //       id: "b59f239c-c250-4fc2-bc19-738213aba2c7",
    //       cdate: "2025-10-10T13:12:01.788Z",
    //       description: "dsadsadassadssaddsad",
    //       mdate: "2025-10-10T13:12:01.788Z",
    //       name: "dasdsa",
    //       etag: "38cb3838-2ed8-4581-b624-b97df616a0c8",
    //     },
    //     {
    //       id: "a65d3167-4f6e-4f3e-9173-f811c3c7c779",
    //       cdate: "2025-10-10T12:43:34.898Z",
    //       description: null,
    //       mdate: "2025-10-10T12:43:34.898Z",
    //       name: "ddsadasdasdasd",
    //       etag: "b9104369-f396-4979-b3a5-32abf01cf55b",
    //     },
    //     {
    //       id: "fac86bf8-6e3c-4edf-b9f4-8a5fd3edf026",
    //       cdate: "2025-10-10T12:41:26.060Z",
    //       description: null,
    //       mdate: "2025-10-10T12:41:26.060Z",
    //       name: "ddddddddddddddasdad",
    //       etag: "fac37406-b706-4b82-8bf5-c971dc1a89df",
    //     },
    //     {
    //       id: "eed024b6-e3c7-4dc5-8515-fe508d88fea2",
    //       cdate: "2025-10-10T12:30:24.870Z",
    //       description:
    //         "dasdsad asdsd sada das dsadsadasd asdsa sadddddddddddddddddddddddddddddddd",
    //       mdate: "2025-10-10T12:30:24.870Z",
    //       name: "dddsadaddsadd",
    //       etag: "53e5afa5-6a25-4e5e-9adb-ce128f642a3c",
    //     },
    //     {
    //       id: "591e6b43-75e2-4440-a2bc-118d90250b7d",
    //       cdate: "2025-10-10T12:18:01.990Z",
    //       description: null,
    //       mdate: "2025-10-10T12:18:01.990Z",
    //       name: "dasddsadd",
    //       etag: "f15608bd-cee5-4f26-9461-97db62ebac3a",
    //     },
    //     {
    //       id: "af7584f7-d88b-4991-9d0a-331ce5980455",
    //       cdate: "2025-10-10T12:17:58.134Z",
    //       description: null,
    //       mdate: "2025-10-10T12:17:58.134Z",
    //       name: "dasdaadasdd",
    //       etag: "83401f60-69f0-4b87-a0f8-e8179b0d4b8d",
    //     },
    //   ] as any,
    // });
  } catch (error: unknown) {
    useAccessGroupsManagementStore.setState({
      busy: false,
      error: parseError(error),
    });
  }
};

export { getYourAccessGroupsAct };
