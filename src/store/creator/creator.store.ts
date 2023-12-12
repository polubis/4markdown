import { create } from 'zustand';

const initialCode = `# 1

This is the paragraph

\`\`\`javascript
const a = 'Thanks for using our editor!'
\`\`\`

## 2

This is the paragraph

### 3

This is the paragraph

#### 4

This is the paragraph

##### 5

This is the paragraph

###### 6

This is the paragraph

![Alt of image](https://img.freepik.com/premium-wektory/dobry-widok-na-gory-grafika-ilustracja-projekt-koszulki-wektor-sztuki_24519-2593.jpg?w=2000)
*Description of image!*

Colons can be used to align columns.

| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |

There must be at least 3 dashes separating each header cell.
The outer pipes (|) are optional, and you don't need to make the 
raw Markdown line up prettily. You can also use inline Markdown.

Markdown | Less | Pretty
--- | --- | ---
*Still* | \`renders\` | **nicely**
1 | 2 | 3
`;

interface CreatorStoreActions {
  change(code: string): void;
  clear(): void;
  reset(): void;
  sync(): void;
  divide(): void;
}

interface CreatorStoreState {
  initialCode: string;
  code: string;
  divideMode: 'both' | 'preview' | 'code';
}

const CREATOR_STORE_LS_KEY = `code`;

const useCreatorStore = create<CreatorStoreState>(() => ({
  initialCode,
  code: initialCode,
  divideMode: `both`,
  splitted: false,
}));

const { setState: set, getState: get } = useCreatorStore;

const creatorStoreActions: CreatorStoreActions = {
  change: (code) => {
    set({ code });
    localStorage.setItem(CREATOR_STORE_LS_KEY, code);
  },
  clear: () => {
    set({ code: `` });
    localStorage.setItem(CREATOR_STORE_LS_KEY, ``);
  },
  reset: () => {
    set({ code: initialCode });
    localStorage.setItem(CREATOR_STORE_LS_KEY, initialCode);
  },
  sync: () => {
    const code = localStorage.getItem(CREATOR_STORE_LS_KEY);

    if (code !== null) {
      set({ code });
    }
  },
  divide: () => {
    const { divideMode } = get();

    if (divideMode === `both`) {
      set({ divideMode: `code` });
      return;
    }

    if (divideMode === `code`) {
      set({ divideMode: `preview` });
      return;
    }

    set({ divideMode: `both` });
  },
};

export { useCreatorStore, CREATOR_STORE_LS_KEY, creatorStoreActions };
