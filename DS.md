## Exporting and Importing

1. All should be exported at the bottom of the file (always)

## Working with State Management

To make code consistent, the following standardized structure for the store must be applied:

```typescript
[store][name - of - feature - folder];
index.ts; // file containing hooks "useFeatureNameState" hook and initialization logic
models.ts; // defines the shape of the state
actions.ts; // contains reusable logic for store changes
selectors.ts; // contains reusable logic for state selection
```

For cases where multiple actions need to be called from features, wrap these calls within an `act`, and put there:

```typescript
[acts-folder]
   -name-of-function.act.ts
```

---

### Example Code

#### Models (`models.ts`)

```typescript
// [store]/[images]/models.ts file
import type { Transaction } from 'development-kit/utility-types';

type UploadImageState = Transaction;

export type { UploadImageState };
```

**Rules:**

1. **Required for every use case.**
2. Use the `State` postfix in the type name (e.g., `UploadImageState`).
3. Always export as a `type`.

---

#### Index (`index.ts`)

```typescript
// [store]/[images]/index.ts file
import { state } from 'development-kit/state';
import type { UploadImageState } from './models';

const useUploadImageState = state<UploadImageState>({ is: `idle` });

export { useUploadImageState };
```

**Rules:**

1. **Required for every use case.**
2. Exports only created hook with name `useUploadImageState` and adds postfix `State` at the end.

---

#### Actions (`actions.ts`)

```typescript
// [store]/[images]/actions.ts file
import { useUploadImageState } from '.';
import type { UploadImageState } from './models';

const resetImagesAction = (state: UploadImageState): void => {
  if (state.is !== `idle`) useUploadImageState.swap(state);
};

export { resetImagesAction };
```

**Rules:**

1. **Optional** — create actions only if needed to avoid duplication.
2. Use the `Action` postfix in the function name.
3. Always define a return type.
4. Actions are always synchronous (`sync`) functions without side effects.

---

#### Selectors (`selectors.ts`)

```typescript
// [store]/[images]/selectors.ts file
import { useUploadImageState } from '.';
import type { UploadImageState } from './models';

const imageSelector = (state: UploadImageState): UploadImageState['images'] =>
  state.images;

export { imageSelector };
```

**Rules:**

1. Selectors must always have the `Selector` postfix in their name.
2. Explicitly define return types (e.g., `UploadImageState['images']`).
3. Use selectors to avoid duplication in state access logic.

---

#### Acts (`acts/name-of-act.act.ts`)

```typescript
// [acts]/upload-image.act.ts
import { getAPI, parseError } from 'api-4markdown';
import { readFileAsBase64 } from 'development-kit/file-reading';
import type { API4MarkdownDto } from 'api-4markdown-contracts';
import { useUploadImageState } from 'store/images';
import type { AsyncResult } from 'development-kit/utility-types';

const uploadImageAct = async (
  image: File,
): AsyncResult<API4MarkdownDto<'uploadImage'>> => {
  try {
    useUploadImageState.swap({ is: `busy` });

    const data = await getAPI().call(`uploadImage`)({
      image: await readFileAsBase64(image),
    });

    useUploadImageState.swap({ is: `ok` });

    return { is: `ok`, data };
  } catch (rawError: unknown) {
    const error = parseError(rawError);
    useUploadImageState.swap({ is: `fail`, error });

    return { is: `fail`, error };
  }
};

export { uploadImageAct };
```

**Rules:**

1. Acts must use the `Act` postfix in their name.
2. Globally available functions encapsulating complex processes.
3. Combine multiple steps, state updates, actions, side effects, and API interactions in a reusable function.
4. Acts must always have a `return type`.
5. Acts can be synchronous (`sync`) or asynchronous (`async`).

## Types and Interfaces

The following rules should be applied:

1. If a component is "local" and does not have many properties passed to it, consider defining its contract without an additional `type`.

```typescript
// A component used primarily for readability, to avoid large chunks of JSX
const SocialShare = ({ content }: { content: string }) => {};
```

## Working with Contracts

1. Create some utility types that are reused accross contracts

```typescript
type Node<TType extends string, TData extends Record<string, unknown>> = {
  id: Id;
  position: {
    x: number;
    y: number;
  };
  type: TType;
  data: Prettify<
    TData & {
      name: string;
      description: string;
    }
  >;
};

type Edge<TType extends string> = {
  id: Id;
  type: TType;
  source: Id;
  target: Id;
};

type DocumentNode = Node<`document`, { document: DocumentDto }>;
type ExternalNode = Node<`external`, { url: Url }>;
type EmbeddedNode = Node<`embedded`, { content: MarkdownContent }>;
type NestedNode = Node<`nested`, { id: Id }>;
type MindmapNode = DocumentNode | ExternalNode | EmbeddedNode | NestedNode;

type UnvisitedEdge = Edge<`unvisited`>;
type VisitedEdge = Edge<`visited`>;
type CheckedEdge = Edge<`checked`>;
type MindmapEdge = UnvisitedEdge | VisitedEdge | CheckedEdge;

type Mindmap = {
  id: Id;
  name: string;
  nodes: MindmapNode[];
  edges: MindmapEdge[];
};

export type {
  Mindmap,
  MindmapNode,
  DocumentNode,
  ExternalNode,
  EmbeddedNode,
};
```

2. Use them in contract file

```typescript
type GetYourDocumentsContract = Contract<
  `getYourDocuments`,
  (
    | PrivateDocument
    | Omit<PublicDocument, 'author' | 'rating'>
    | Omit<PermanentDocument, 'author' | 'rating'>
  )[]
>;
```

3. Read contract values via utility extracting types

```typescript
type GetYourDocumentDto = API4MarkdownDto<`getYourDocuments`>;
type GetYourDocumentPayload = API4MarkdownPayload<`getYourDocuments`>;
```