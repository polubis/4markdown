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

type ImagesState = Transaction;

export type { ImagesState };
```

**Rules:**

1. **Required for every use case.**
2. Use the `State` postfix in the type name (e.g., `ImagesState`).
3. Always export as a `type`.

---

#### Index (`index.ts`)

```typescript
// [store]/[images]/index.ts file
import { state } from 'development-kit/state';
import type { ImagesState } from './models';

const useImagesState = state<ImagesState>({ is: `idle` });

export { useImagesState };
```

**Rules:**

1. **Required for every use case.**
2. Exports only created hook with name `useImagesState` and adds postfix `State` at the end.

---

#### Actions (`actions.ts`)

```typescript
// [store]/[images]/actions.ts file
import { useImagesState } from '.';
import type { ImagesState } from './models';

const resetImagesAction = (state: ImagesState): void => {
  if (state.is !== `idle`) useImagesState.swap(state);
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
import { useImagesState } from '.';
import type { ImagesState } from './models';

const imageSelector = (state: ImagesState): ImagesState['images'] =>
  state.images;

export { imageSelector };
```

**Rules:**

1. Selectors must always have the `Selector` postfix in their name.
2. Explicitly define return types (e.g., `ImagesState['images']`).
3. Use selectors to avoid duplication in state access logic.

---

#### Acts (`acts/name-of-act.act.ts`)

```typescript
// [acts]/upload-image.act.ts
import { getAPI, parseError } from 'api-4markdown';
import { readFileAsBase64 } from 'development-kit/file-reading';
import type { API4MarkdownDto } from 'api-4markdown-contracts';
import { useImagesState } from 'store/images';
import type { AsyncResult } from 'development-kit/utility-types';

const uploadImageAct = async (
  image: File,
): AsyncResult<API4MarkdownDto<'uploadImage'>> => {
  try {
    useImagesState.swap({ is: `busy` });

    const data = await getAPI().call(`uploadImage`)({
      image: await readFileAsBase64(image),
    });

    useImagesState.swap({ is: `ok` });

    return { is: `ok`, data };
  } catch (rawError: unknown) {
    const error = parseError(rawError);
    useImagesState.swap({ is: `fail`, error });

    return { is: `fail`, error };
  }
};

export { uploadImageAct };
```

**Rules:**

1. Acts must use the `Act` postfix in their name.
2. Globally available functions encapsulating complex processes.
3. Combine multiple steps, state updates, actions, side effects, and API interactions in a reusable function.
4. Acts **must return** either an `AsyncResult` or `Result` type.
5. Acts can be synchronous (`sync`) or asynchronous (`async`).