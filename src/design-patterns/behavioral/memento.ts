type NotFunction<TSignature> = TSignature extends (
  ...args: unknown[]
) => unknown
  ? never
  : TSignature;

interface Memento<TValue> {
  getState(): Readonly<NotFunction<TValue>>;
}

class TextEditorSnap implements Memento<string> {
  constructor(private _state: string) {
    if (typeof this._state === `function`)
      throw Error(`Functions cannot be used`);

    if (typeof this._state === `object` && this._state !== null) {
      this._state = Object.freeze(this._state);
    }
  }

  getState(): string {
    return this._state;
  }
}

class TextEditor {
  constructor(private _content: string) {}

  get content() {
    return this._content;
  }

  type(words: string): void {
    this._content += words;
  }

  save(): Memento<string> {
    return new TextEditorSnap(this._content);
  }

  restore(memento: Memento<string> | undefined): void {
    if (memento) {
      this._content = memento.getState();
    }
  }
}

class EditorHistory {
  private _mementos: Memento<string>[] = [];

  add(memento: Memento<string>): void {
    this._mementos.push(memento);
  }

  getAt(index: number): Memento<string> | undefined {
    return this._mementos[index];
  }

  first(): Memento<string> | undefined {
    return this._mementos[this._mementos.length - 1];
  }
}

const editor = new TextEditor(`Hi`);
const editorHistory = new EditorHistory();

console.log(editor.content); // Hi

editor.type(`, `);
console.log(editor.content); // Hi,
editorHistory.add(editor.save());

editor.type(`Josh`);
editor.type(` `);
console.log(editor.content); // Hi, Josh
editorHistory.add(editor.save());

editor.type(`What's up?`);
console.log(editor.content); // Hi, Josh What's up?

editor.restore(editorHistory.getAt(1));
console.log(editor.content); // Hi, Josh

editor.restore(editorHistory.first());
console.log(editor.content); // Hi, Josh
