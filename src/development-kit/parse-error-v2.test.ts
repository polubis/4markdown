import { parseErrorV2 } from './parse-error-v2';
import { expect } from '@jest/globals';

describe(`Error parsing works when`, () => {
  it(`parses already-exists error correctly`, () => {
    const errorString = JSON.stringify({
      symbol: `already-exists`,
      content: `Some content`,
    });
    const result = parseErrorV2(errorString);
    expect(result).toEqual({
      symbol: `already-exists`,
      content: `Some content`,
    });
  });

  it(`parses unauthenticated error correctly`, () => {
    const errorString = JSON.stringify({
      symbol: `unauthenticated`,
      content: `Some content`,
    });
    const result = parseErrorV2(errorString);
    expect(result).toEqual({
      symbol: `unauthenticated`,
      content: `Some content`,
    });
  });

  it(`parses internal error correctly`, () => {
    const errorString = JSON.stringify({
      symbol: `internal`,
      content: `Some content`,
    });
    const result = parseErrorV2(errorString);
    expect(result).toEqual({ symbol: `internal`, content: `Some content` });
  });

  it(`parses invalid-schema error correctly`, () => {
    const errorString = JSON.stringify({
      symbol: `invalid-schema`,
      content: [{ key: `key1`, message: `Some message` }],
    });
    const result = parseErrorV2(errorString);
    expect(result).toEqual({
      symbol: `invalid-schema`,
      content: [{ key: `key1`, message: `Some message` }],
    });
  });

  it(`parses not-found error correctly`, () => {
    const errorString = JSON.stringify({
      symbol: `not-found`,
      content: `Some content`,
    });
    const result = parseErrorV2(errorString);
    expect(result).toEqual({ symbol: `not-found`, content: `Some content` });
  });

  it(`parses out-of-date error correctly`, () => {
    const errorString = JSON.stringify({
      symbol: `out-of-date`,
      content: `Some content`,
    });
    const result = parseErrorV2(errorString);
    expect(result).toEqual({ symbol: `out-of-date`, content: `Some content` });
  });

  it(`parses bad-request error correctly`, () => {
    const errorString = JSON.stringify({
      symbol: `bad-request`,
      content: `Some content`,
    });
    const result = parseErrorV2(errorString);
    expect(result).toEqual({ symbol: `bad-request`, content: `Some content` });
  });

  it(`returns unknown error for invalid JSON string`, () => {
    const result = parseErrorV2(`invalid JSON string`);
    expect(result).toEqual({
      symbol: `unknown`,
      content: `Unknown error occured`,
    });
  });

  it(`returns unknown error for non-string input (number)`, () => {
    const result = parseErrorV2(123);
    expect(result).toEqual({
      symbol: `unknown`,
      content: `Unknown error occured`,
    });
  });

  it(`returns unknown error for non-string input (object)`, () => {
    const result = parseErrorV2({ key: `value` });
    expect(result).toEqual({
      symbol: `unknown`,
      content: `Unknown error occured`,
    });
  });

  it(`returns unknown error for non-string input (array)`, () => {
    const result = parseErrorV2([1, 2, 3]);
    expect(result).toEqual({
      symbol: `unknown`,
      content: `Unknown error occured`,
    });
  });

  it(`returns unknown error for non-string input (boolean)`, () => {
    const result = parseErrorV2(true);
    expect(result).toEqual({
      symbol: `unknown`,
      content: `Unknown error occured`,
    });
  });

  it(`returns unknown error for missing symbol`, () => {
    const errorString = JSON.stringify({ content: `Some content` });
    const result = parseErrorV2(errorString);
    expect(result).toEqual({
      symbol: `unknown`,
      content: `Unknown error occured`,
    });
  });

  it(`returns unknown error for empty string`, () => {
    const result = parseErrorV2(``);
    expect(result).toEqual({
      symbol: `unknown`,
      content: `Unknown error occured`,
    });
  });

  it(`returns unknown error for malformed JSON`, () => {
    const result = parseErrorV2(
      `{"symbol": "internal", "content": "Some content"`,
    );
    expect(result).toEqual({
      symbol: `unknown`,
      content: `Unknown error occured`,
    });
  });

  it(`returns unknown error for valid JSON with missing content`, () => {
    const errorString = JSON.stringify({ symbol: `internal` });
    const result = parseErrorV2(errorString);
    expect(result).toEqual({
      symbol: `unknown`,
      content: `Unknown error occured`,
    });
  });

  it(`returns unknown error for valid JSON with additional properties`, () => {
    const errorString = JSON.stringify({
      symbol: `internal`,
      content: `Some content`,
      extra: `extra property`,
    });
    const result = parseErrorV2(errorString);
    expect(result).toEqual({ symbol: `internal`, content: `Some content` });
  });

  it(`returns unknown error when not supported symbol is returned`, () => {
    const errorString = JSON.stringify({
      symbol: `totally-unknown-random-symbol`,
      content: `Some content`,
    });
    const result = parseErrorV2(errorString);
    expect(result).toEqual({
      symbol: `unknown`,
      content: `Unknown error occured`,
    });
  });

  it(`returns unknown error when schema error has invalid shape`, () => {
    expect(
      parseErrorV2(
        JSON.stringify({
          symbol: `invalid-schema`,
          content: [],
        }),
      ),
    ).toEqual({
      symbol: `unknown`,
      content: `Unknown error occured`,
    });
    expect(
      parseErrorV2(
        JSON.stringify({
          symbol: `invalid-schema`,
          content: [
            {
              key: undefined,
              content: `Something went wrong`,
            },
          ],
        }),
      ),
    ).toEqual({
      symbol: `unknown`,
      content: `Unknown error occured`,
    });
    expect(
      parseErrorV2(
        JSON.stringify({
          symbol: `invalid-schema`,
          content: [
            {
              key: `error`,
              content: undefined,
            },
          ],
        }),
      ),
    ).toEqual({
      symbol: `unknown`,
      content: `Unknown error occured`,
    });
  });
});
