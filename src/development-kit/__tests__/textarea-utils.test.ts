import { replaceText, getSelectedText } from "../textarea-utils";
import { expect } from "@jest/globals";

describe(getSelectedText.name, () => {
  it(`returns null when selection start and end are the same`, () => {
    expect(
      getSelectedText({
        value: `abcdefgh`,
        selectionStart: 0,
        selectionEnd: 0,
      }),
    ).toEqual(null);
  });

  it(`works with single line`, () => {
    expect(
      getSelectedText({
        value: `abcdefgh`,
        selectionStart: 0,
        selectionEnd: 3,
      }),
    ).toEqual(`abc`);
  });

  describe(`works with duplicates`, () => {
    it(`when text at beginning is selected`, () => {
      const value = `aaaaaaaaaa

bbbbbbbbbb

aaaaa

bbbbbbbbbb`;

      expect(
        getSelectedText({
          value,
          selectionStart: 12,
          selectionEnd: 22,
        }),
      ).toEqual(`bbbbbbbbbb`);
    });

    it(`when text at end is selected`, () => {
      const value = `aaaaaaaaaa

bbbbbbbbbb

aaaaa

bbbbbbbbbb`;

      expect(
        getSelectedText({
          value,
          selectionStart: 31,
          selectionEnd: 41,
        }),
      ).toEqual(`bbbbbbbbbb`);
    });
  });
});

describe(replaceText.name, () => {
  it(`returns passed value when selection start and end are the same`, () => {
    expect(
      replaceText({
        value: `abcdefgh`,
        selectionStart: 0,
        selectionEnd: 0,
        valueToReplace: `AI`,
      }),
    ).toEqual(`abcdefgh`);
  });

  it(`works with single line`, () => {
    expect(
      replaceText({
        value: `abcdefgh`,
        selectionStart: 0,
        selectionEnd: 3,
        valueToReplace: `AI`,
      }),
    ).toEqual(`AIdefgh`);
  });

  describe(`works with duplicates`, () => {
    it(`when text at beginning is selected`, () => {
      const value = `aaaaaaaaaa

bbbbbbbbbb

aaaaa

bbbbbbbbbb`;

      const result = `aaaaaaaaaa

AI

aaaaa

bbbbbbbbbb`;

      expect(
        replaceText({
          value,
          selectionStart: 12,
          selectionEnd: 22,
          valueToReplace: `AI`,
        }),
      ).toEqual(result);
    });

    it(`when text at end is selected`, () => {
      const value = `aaaaaaaaaa

bbbbbbbbbb

aaaaa

bbbbbbbbbb`;

      const result = `aaaaaaaaaa

bbbbbbbbbb

aaaaa

AI`;

      expect(
        replaceText({
          value,
          selectionStart: 31,
          selectionEnd: 41,
          valueToReplace: `AI`,
        }),
      ).toEqual(result);
    });
  });
});
