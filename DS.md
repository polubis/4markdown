## Working with State Management

The following standardized structure for the store must be applied to all use cases:

```typescript
[store][name - of - feature - folder];
index.ts; // file containing hooks to read state + initial logic
models.ts; // defines the shape of the state
actions.ts; // contains reusable logic for store changes
selectors.ts; // contains reusable logic for state selection
```

For cases where multiple actions ("n" actions) need to be called from features, wrap these calls within an `act`, as demonstrated:

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
import { create } from 'zustand';
import type { ImagesState } from './models';

const useImagesState = create<ImagesState>(() => ({
  is: `idle`,
}));
const getImagesState = useImagesState.getState;
const setImagesState = useImagesState.setState;
const replaceImagesState = (state: ImagesState): void => {
  useImagesState.setState(state, true);
};

export { useImagesState, getImagesState, setImagesState, replaceImagesState };
```

**Rules:**

1. **Required for every use case.**
2. Always adhere to this exact structure.
3. Export **four distinct functions**:
   - `useImagesState` for hooks.
   - `getImagesState` for reading state.
   - `setImagesState` for updating state.
   - `replaceImagesState` for replacing the entire state.

---

#### Actions (`actions.ts`)

```typescript
// [store]/[images]/actions.ts file
import { replaceImagesState } from '.';
import type { ImagesState } from './models';

const resetImagesAction = (state: ImagesState): void => {
  if (state.is !== `idle`) replaceImagesState(state);
};

export { resetImagesAction };
```

**Rules:**

1. **Optional** — create actions only if needed to avoid duplication.
2. Use the `Action` postfix in the function name.
3. Always define a return type.
4. Actions are always `sync` functions.

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
// [acts]/uploadImage.act.ts
import { getAPI, parseError } from 'api-4markdown';
import { readFileAsBase64 } from 'development-kit/file-reading';
import type { API4MarkdownDto } from 'api-4markdown-contracts';
import type { AsyncResult } from 'development-kit/utility-types';
import { resetImagesAction } from 'store/images/actions';

const uploadImageAct = async (
  image: File,
): AsyncResult<API4MarkdownDto<'uploadImage'>> => {
  try {
    resetImagesAction({ is: `busy` });

    const data = await getAPI().call(`uploadImage`)({
      image: await readFileAsBase64(image),
    });

    resetImagesAction({ is: `ok` });

    return { is: `ok`, data };
  } catch (rawError: unknown) {
    const error = parseError(rawError);

    resetImagesAction({ is: `fail`, error });

    return { is: `fail`, error };
  }
};

export { uploadImageAct };
```

**Rules:**

1. Acts must use the `Act` postfix in their name.
2. Globally available functions encapsulating complex processes.
3. Combine multiple steps, state updates, actions, and API interactions in a reusable function.
4. Acts **must return** either an `AsyncResult` or `Result` type.
5. Acts can be either `sync` or `async`.
