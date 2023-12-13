import { create } from 'zustand';

const initialCode = `# Markdown Cheatsheet

Separate every paragraph of text with \`enter\`. Suppose you want to create bolding use **bolding**. The _italic_ text requires a "_" symbol. 

It works great with the [Grammarly Chrome Extension](https://chromewebstore.google.com/detail/grammarly-grammar-checker/kbfnbcaeplbcioakkpcpgfkobkghlhen?pli=1) - this is for people who don't know **English** language well as me 🤝. 

## How to add inline code?

To add inline code use the"\`" symbol to wrap concrete text. For example:

\`const a = 5\`. Remember to use escape characters like *"/"* to type symbols that are used for markdown creation. 

### Additional information

We're supporting most of the **Markdown** tags, however, some of them may not work correctly. In this case, remember to inform us on our [LinkedIn](https://www.linkedin.com/company/greenon-software/) profile or [Discord](https://discord.com/invite/PxXQayT3x3) channel. 

#### How to create a table?

| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |

#### How to add a block quote?

> That's the additional information to display in the block quote.

#### How to create a code snippet?

The code snippet in \`JavaScript\`.

\`\`\`javascript
const a = 5;
const b = 10;

const add = () => {
   return a + b;
}
\`\`\`

#### How to add an image or links?

![Alt of image](https://img.freepik.com/premium-wektory/dobry-widok-na-gory-grafika-ilustracja-projekt-koszulki-wektor-sztuki_24519-2593.jpg?w=2000)
*This is my image description!*

##### If you enjoyed this editor

Like our [LinkedIn](https://www.linkedin.com/company/greenon-software/) profile or join [Discord](https://discord.com/invite/PxXQayT3x3) channel. In addition, we're working on other applications and we have an education platform that creates content for free - [GreenOn Software](https://greenonsoftware.com/)! 

###### Thanks for using our editor!

Any suggestions, comments, or ideas for improvement? Feel free to join our [Discord](https://discord.com/invite/PxXQayT3x3) or add info on [LinkedIn](https://www.linkedin.com/company/greenon-software/) profile. If you want to contribute, here you have a repository:  [4Markdown repository](https://github.com/polubis/4markdown).`;

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
