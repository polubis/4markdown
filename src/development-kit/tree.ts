type Id = number | string;
type BaseOfData = Record<Id, any>;
type ParentId = Id | null;

type RTreeNode<Data extends BaseOfData> = { [key: Id]: any } & {
  id: Id;
  children: RTreeNode<Data>[];
};

type RTree<Data extends BaseOfData> = RTreeNode<Data>[];

type FTreeNode<Data extends BaseOfData> = Data & {
  id: Id;
  level: number;
  parentId: ParentId;
};

type FTree<Data extends BaseOfData> = FTreeNode<Data>[];

const rtree: RTree<{ username: string }> = [
  {
    id: 1,
    username: `Piotr1994`,
    children: [
      {
        id: 2,
        username: `Jarosz`,
        children: [
          {
            id: 4,
            username: `Piotr`,
            children: [
              {
                id: 6,
                username: `Cfelu`,
                children: [],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 3,
    username: `Bob`,
    children: [{ id: 5, username: `XD`, children: [] }],
  },
];

const ftree: FTree<{ username: string }> = [
  {
    id: 1,
    username: `Piotr1994`,
    parentId: null,
    level: 0,
  },
  {
    id: 2,
    username: `Tom19`,
    parentId: 1,
    level: 1,
  },
  {
    id: 3,
    username: `Ryszard`,
    parentId: 2,
    level: 2,
  },
  {
    id: 4,
    username: `Ewcia`,
    parentId: 2,
    level: 2,
  },
  {
    id: 5,
    username: `Jaro`,
    parentId: 3,
    level: 3,
  },
];

const makeFreeFlat = <Data extends BaseOfData>(
  rtree: RTree<Data>,
): FTree<Data> => {
  const result: FTree<Data> = [];

  const traverse = (rtree: RTree<Data>, parentId: ParentId, level: number) => {
    if (rtree.length === 0) return;

    rtree.forEach(({ id, children, ...data }) => {
      result.push({
        id,
        parentId,
        level,
        ...(data as Data),
      });

      traverse(children, id, level + 1);
    });
  };

  traverse(rtree, null, 0);

  return result;
};

const findNearestParent = <Data extends BaseOfData>(
  parentId: ParentId,
  ftree: FTree<Data>,
): FTreeNode<Data> | null => {
  return ftree.find((node) => node.parentId === parentId) ?? null;
};

export { ftree, rtree, makeFreeFlat, findNearestParent };
