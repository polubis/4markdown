import { Visibility, type Mindmap } from 'api-4markdown-contracts';

const otherMindmap: Mindmap = {
  id: `0a3ca785-baf5-418d-8c1a-905223`,
  name: `Other mindmap`,
  description: null,
  visibility: Visibility.Private,
  cdate: `2025-01-24T14:06:10.550Z`,
  orientation: `y`,
  mdate: `2025-01-24T14:06:10.550Z`,
  edges: [
    {
      id: `2024-09-02T07:27:45.696Z`,
      type: `visited`,
      source: `2024-09-02T07:27:37.297Z`,
      target: `2024-09-02T07:27:41.792Z`,
    },
    {
      id: `2024-09-02T07:27:53.288Z`,
      type: `unvisited`,
      source: `2024-09-02T07:27:37.297Z`,
      target: `2024-09-02T07:27:48.816Z`,
    },
    {
      id: `2024-09-02T07:28:02.792Z`,
      type: `done`,
      source: `2024-09-02T07:27:37.297Z`,
      target: `2024-09-02T07:27:56.168Z`,
    },
    {
      id: `2024-09-02T07:35:05.989Z`,
      type: `unvisited`,
      source: `2024-09-02T07:27:41.792Z`,
      target: `2024-09-02T07:30:12.153Z`,
    },
    {
      id: `2024-09-02T07:35:07.629Z`,
      type: `unvisited`,
      source: `2024-09-02T07:27:41.792Z`,
      target: `2024-09-02T07:30:26.569Z`,
    },
    {
      id: `2024-09-02T07:35:52.893Z`,
      type: `unvisited`,
      source: `2024-09-02T07:27:37.297Z`,
      target: `2024-09-02T07:35:46.182Z`,
    },
    {
      id: `2024-09-02T07:36:01.613Z`,
      type: `unvisited`,
      source: `2024-09-02T07:27:37.297Z`,
      target: `2024-09-02T07:35:56.310Z`,
    },
    {
      id: `2024-09-02T07:36:10.500Z`,
      type: `unvisited`,
      source: `2024-09-02T07:27:37.297Z`,
      target: `2024-09-02T07:36:05.726Z`,
    },
    {
      id: `2024-09-02T07:36:21.132Z`,
      type: `unvisited`,
      source: `2024-09-02T07:27:37.297Z`,
      target: `2024-09-02T07:36:15.950Z`,
    },
  ],
  nodes: [
    {
      id: `2024-09-02T07:27:37.297Z`,
      position: {
        x: -251.2454699432884,
        y: -575.6769977307954,
      },
      data: {
        name: `20240822T06K46K48423Z`,
        description: ``,
        document: {
          id: `0b2a9bfe-361e-40d9-a880-89df383b63e5`,
          name: `20240822T06K46K48423Z`,
          cdate: `2024-08-22T06:47:06.436Z`,
          mdate: `2024-08-22T06:47:06.436Z`,
          visibility: `private`,
          path: `/my-content/`,
          code: `## My content`,
        },
      },
      type: `document`,
    },
    {
      id: `2024-09-02T07:27:41.792Z`,
      position: {
        x: -295.2326086519489,
        y: 0.8923987913104554,
      },
      data: {
        name: `20240822T05K58K20943Z`,
        description: ``,
        url: `https:4///dasd.com`,
      },
      type: `external`,
    },
    {
      id: `2024-09-02T07:27:48.816Z`,
      position: {
        x: 15.351801673599283,
        y: 24.008153616380355,
      },
      data: {
        name: `20240822T06K46K48423Z`,
        description: `dasdsdsadasdasdasasd`,
        document: {
          id: `0b2a9bfe-361e-40d9-a880-89df383b63e5`,
          name: `20240822T06K46K48423Z`,
          cdate: `2024-08-22T06:47:06.436Z`,
          mdate: `2024-08-22T06:47:06.436Z`,
          path: `/my-content/`,
          visibility: `private`,
          code: `## My content`,
        },
      },
      type: `document`,
    },
    {
      id: `2024-09-02T07:27:56.168Z`,
      position: {
        x: -618.7895184509166,
        y: -5.2762347986934515,
      },
      data: {
        name: `20240821T13K05K09508Z`,
        description: ``,
        content: `# dasdda adds`,
      },
      type: `embedded`,
    },
  ],
};

const defaultMindmap: Mindmap = {
  id: `0a3ca785-baf5-418d-8c1a-90521117d3c1`,
  name: `It's default mindmap`,
  description: null,
  visibility: Visibility.Private,
  cdate: `2025-01-24T14:06:10.550Z`,
  orientation: `y`,
  mdate: `2025-01-24T14:06:10.550Z`,
  edges: [
    {
      id: `2024-09-02T07:27:45.696Z`,
      type: `visited`,
      source: `2024-09-02T07:27:37.297Z`,
      target: `2024-09-02T07:27:41.792Z`,
    },
    {
      id: `2024-09-02T07:27:53.288Z`,
      type: `unvisited`,
      source: `2024-09-02T07:27:37.297Z`,
      target: `2024-09-02T07:27:48.816Z`,
    },
    {
      id: `2024-09-02T07:28:02.792Z`,
      type: `done`,
      source: `2024-09-02T07:27:37.297Z`,
      target: `2024-09-02T07:27:56.168Z`,
    },
    {
      id: `2024-09-02T07:35:05.989Z`,
      type: `unvisited`,
      source: `2024-09-02T07:27:41.792Z`,
      target: `2024-09-02T07:30:12.153Z`,
    },
    {
      id: `2024-09-02T07:35:07.629Z`,
      type: `unvisited`,
      source: `2024-09-02T07:27:41.792Z`,
      target: `2024-09-02T07:30:26.569Z`,
    },
    {
      id: `2024-09-02T07:35:52.893Z`,
      type: `unvisited`,
      source: `2024-09-02T07:27:37.297Z`,
      target: `2024-09-02T07:35:46.182Z`,
    },
    {
      id: `2024-09-02T07:36:01.613Z`,
      type: `unvisited`,
      source: `2024-09-02T07:27:37.297Z`,
      target: `2024-09-02T07:35:56.310Z`,
    },
    {
      id: `2024-09-02T07:36:10.500Z`,
      type: `unvisited`,
      source: `2024-09-02T07:27:37.297Z`,
      target: `2024-09-02T07:36:05.726Z`,
    },
    {
      id: `2024-09-02T07:36:21.132Z`,
      type: `unvisited`,
      source: `2024-09-02T07:27:37.297Z`,
      target: `2024-09-02T07:36:15.950Z`,
    },
  ],
  nodes: [
    {
      id: `2024-09-02T07:27:37.297Z`,
      position: {
        x: -251.2454699432884,
        y: -575.6769977307954,
      },
      data: {
        name: `20240822T06K46K48423Z`,
        description: ``,
        document: {
          id: `0b2a9bfe-361e-40d9-a880-89df383b63e5`,
          name: `20240822T06K46K48423Z`,
          cdate: `2024-08-22T06:47:06.436Z`,
          mdate: `2024-08-22T06:47:06.436Z`,
          visibility: `private`,
          path: `/my-content/`,
          code: `## My content`,
        },
      },
      type: `document`,
    },
    {
      id: `2024-09-02T07:27:41.792Z`,
      position: {
        x: -295.2326086519489,
        y: 0.8923987913104554,
      },
      data: {
        name: `20240822T05K58K20943Z`,
        description: ``,
        url: `https:4///dasd.com`,
      },
      type: `external`,
    },
    {
      id: `2024-09-02T07:27:48.816Z`,
      position: {
        x: 15.351801673599283,
        y: 24.008153616380355,
      },
      data: {
        name: `20240822T06K46K48423Z`,
        description: `dasdsdsadasdasdasasd`,
        document: {
          id: `0b2a9bfe-361e-40d9-a880-89df383b63e5`,
          name: `20240822T06K46K48423Z`,
          cdate: `2024-08-22T06:47:06.436Z`,
          mdate: `2024-08-22T06:47:06.436Z`,
          path: `/my-content/`,
          visibility: `private`,
          code: `## My content`,
        },
      },
      type: `document`,
    },
    {
      id: `2024-09-02T07:27:56.168Z`,
      position: {
        x: -618.7895184509166,
        y: -5.2762347986934515,
      },
      data: {
        name: `20240821T13K05K09508Z`,
        description: ``,
        content: `# dasdda adds`,
      },
      type: `embedded`,
    },
    {
      id: `2024-09-02T07:30:12.153Z`,
      position: {
        x: -8.957057704121553,
        y: 413.77702936180253,
      },
      data: {
        name: `20240822T05K58K20943Z`,
        description: ``,
        id: otherMindmap.id,
      },
      type: `nested`,
    },
    {
      id: `2024-09-02T07:30:26.569Z`,
      position: {
        x: -541.4609824557458,
        y: 440.5989673451501,
      },
      data: {
        name: `20240821T13K05K09508Z`,
        description: ``,
        document: {
          id: `c6826ac8-e643-47f2-a0d8-45522171fbc7`,
          name: `20240821T13K05K09508Z`,
          cdate: `2024-08-21T13:05:29.333Z`,
          mdate: `2024-08-21T13:05:29.333Z`,
          visibility: `private`,
          path: `/my-content/`,
          code: `## My content`,
        },
      },
      type: `document`,
    },
    {
      id: `2024-09-02T07:35:46.182Z`,
      position: {
        x: 328.81033860310225,
        y: 21.897789558817436,
      },
      data: {
        name: `20240822T05K58K20943Z`,
        description: `dasas ddas asdas asdsa asasdas dasdassdsadasd asasd adasd asdasd asdasd asd`,
        document: {
          id: `484dae9f-df23-4c27-98eb-439a634eb9bd`,
          name: `20240822T05K58K20943Z`,
          cdate: `2024-08-22T05:58:32.391Z`,
          mdate: `2024-08-22T05:58:32.391Z`,
          visibility: `private`,
          path: `/my-content/`,
          code: `## My content`,
        },
      },
      type: `document`,
    },
    {
      id: `2024-09-02T07:35:56.310Z`,
      position: {
        x: 638.1570937147762,
        y: 68.82852016424823,
      },
      data: {
        name: `20240822T05K58K20943Z`,
        description: ``,
        document: {
          id: `484dae9f-df23-4c27-98eb-439a634eb9bd`,
          name: `20240822T05K58K20943Z`,
          cdate: `2024-08-22T05:58:32.391Z`,
          mdate: `2024-08-22T05:58:32.391Z`,
          visibility: `private`,
          path: `/my-content/`,
          code: `## My content`,
        },
      },
      type: `document`,
    },
    {
      id: `2024-09-02T07:36:05.726Z`,
      position: {
        x: 938.784660583905,
        y: 53.17831089021175,
      },
      data: {
        name: `20240821T13K05K09508Z`,
        description: ``,
        document: {
          id: `c6826ac8-e643-47f2-a0d8-45522171fbc7`,
          name: `20240821T13K05K09508Z`,
          cdate: `2024-08-21T13:05:29.333Z`,
          mdate: `2024-08-21T13:05:29.333Z`,
          visibility: `private`,
          path: `/my-content/`,
          code: `## My content`,
        },
      },
      type: `document`,
    },
    {
      id: `2024-09-02T07:36:15.950Z`,
      position: {
        x: 1240.332879649968,
        y: 16.143218036301704,
      },
      data: {
        name: `20240822T05K58K20943Z`,
        description: ``,
        document: {
          id: `484dae9f-df23-4c27-98eb-439a634eb9bd`,
          name: `20240822T05K58K20943Z`,
          cdate: `2024-08-22T05:58:32.391Z`,
          mdate: `2024-08-22T05:58:32.391Z`,
          visibility: `private`,
          path: `/my-content/`,
          code: `## My content`,
        },
      },
      type: `document`,
    },
  ],
};

export { defaultMindmap, otherMindmap };
