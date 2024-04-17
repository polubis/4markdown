import type { SiteMetadata } from 'models/queries';
import { create } from 'zustand';
import LogoThumbnail from 'images/logo-thumbnail.png';

const createInitialCode = (meta: SiteMetadata): string => `# Markdown Cheatsheet

Separate every paragraph/section of text with \`enter\`. Suppose you want to create bolding use **bolding**. The _italic_ text requires a "_" symbol. 

It works great with the [Grammarly Chrome Extension](${meta.grammarlyUrl}) - this is for people who don't know **English** language well as me 🤝. 

To dive deeper through editor features watch the following [Video](${meta.ytVideoTutorialUrl}) on our [YouTube channel](${meta.ytChannelUrl}).

## How to add inline code?

To add inline code use the"\`" symbol to wrap concrete text. For example:

\`const a = 5\`. Remember to use escape characters like *"/"* to type symbols that are used for markdown creation. 

### Additional information

We're supporting most of the **Markdown** tags, however, some of them may not work correctly. In this case, remember to inform us on our [LinkedIn](${meta.linkedInUrl}) profile or [Discord](${meta.discordUrl}) channel. 

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

![Alt of image](${LogoThumbnail})
*${meta.title}*

##### If you enjoyed this editor

Like our [LinkedIn](${meta.linkedInUrl}) profile or join [Discord](${meta.discordUrl}) channel. In addition, we're working on other applications and we have an education platform that creates content for free - [${meta.company}](${meta.companyUrl})! 

###### Thanks for using our editor!

Any suggestions, comments, or ideas for improvement? Feel free to join our [Discord](${meta.discordUrl}) or add info on [LinkedIn](${meta.linkedInUrl}) profile. If you want to contribute, here you have a repository: [${meta.appName} repository](${meta.sourceCodeUrl}).`;

type CreatorStoreStateIdle = { is: 'idle' };
type CreatorStoreStateReady = { is: 'ready' } & {
  initialCode: string;
  code: string;
  changed: boolean;
};

type CreatorStoreState = CreatorStoreStateIdle | CreatorStoreStateReady;

const CREATOR_STORE_LS_KEY = `code`;

const useCreatorStore = create<CreatorStoreState>(() => ({
  is: `idle`,
}));

const { setState, getState: get } = useCreatorStore;

const isReadyState = (state: CreatorStoreState): CreatorStoreStateReady => {
  if (state.is === `idle`) {
    throw Error(`Reading state when not ready`);
  }

  return state;
};

const creatorStoreSelectors = {
  useReady: () => useCreatorStore(isReadyState),
  ready: () => isReadyState(get()),
} as const;

const set = (state: CreatorStoreState): void => {
  setState(state, true);
};

const creatorStoreActions = {
  change: (code: string): void => {
    const { is, initialCode } = creatorStoreSelectors.ready();
    const newState: CreatorStoreStateReady = {
      is,
      code,
      initialCode,
      changed: true,
    };

    set(newState);
    localStorage.setItem(CREATOR_STORE_LS_KEY, JSON.stringify(newState));
  },
  asUnchanged: (): void => {
    const { is, initialCode, code } = creatorStoreSelectors.ready();
    const newState: CreatorStoreStateReady = {
      is,
      code,
      initialCode,
      changed: false,
    };

    set(newState);
    localStorage.setItem(CREATOR_STORE_LS_KEY, JSON.stringify(newState));
  },
  sync: (): void => {
    const state = localStorage.getItem(CREATOR_STORE_LS_KEY) as string | null;

    if (state === null) {
      set(creatorStoreSelectors.ready());
      return;
    }

    set(JSON.parse(state) as CreatorStoreStateReady);
  },
} as const;

export {
  useCreatorStore,
  CREATOR_STORE_LS_KEY,
  creatorStoreActions,
  creatorStoreSelectors,
  createInitialCode,
};
