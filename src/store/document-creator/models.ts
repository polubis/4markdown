namespace DocumentCreator {
  export type Actions = {};
  export type State = {
    code: string;
    changed: boolean;
    display: `both` | `preview` | `code`;
  };
  export type Store = Actions & State;
}

export type { DocumentCreator };
