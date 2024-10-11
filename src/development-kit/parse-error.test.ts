import { parseError } from './parse-error';
import { expect } from '@jest/globals';

describe(`Error parsing works when`, () => {
  it(`parses already-exists error correctly`, () => {
    const errorString = JSON.stringify({
      symbol: `already-exists`,
      content: `Some content`,
      message: `Some content`,
    });
    const result = parseError(errorString);
    expect(result).toEqual({
      symbol: `already-exists`,
      content: `Some content`,
      message: `Some content`,
    });
  });

  it(`parses unauthenticated error correctly`, () => {
    const errorString = JSON.stringify({
      symbol: `unauthenticated`,
      content: `Some content`,
      message: `Some content`,
    });
    const result = parseError(errorString);
    expect(result).toEqual({
      symbol: `unauthenticated`,
      content: `Some content`,
      message: `Some content`,
    });
  });

  it(`parses internal error correctly`, () => {
    const errorString = JSON.stringify({
      symbol: `internal`,
      content: `Some content`,
    });
    const result = parseError(errorString);
    expect(result).toEqual({
      symbol: `internal`,
      content: `Some content`,
      message: `Some content`,
    });
  });

  it(`parses invalid-schema error correctly`, () => {
    const errorString = JSON.stringify({
      symbol: `invalid-schema`,
      content: [{ key: `key1`, message: `Some message` }],
    });
    const result = parseError(errorString);
    expect(result).toEqual({
      symbol: `invalid-schema`,
      content: [{ key: `key1`, message: `Some message` }],
      message: `Some message`,
    });
  });

  it(`parses not-found error correctly`, () => {
    const errorString = JSON.stringify({
      symbol: `not-found`,
      content: `Some content`,
    });
    const result = parseError(errorString);
    expect(result).toEqual({
      symbol: `not-found`,
      content: `Some content`,
      message: `Some content`,
    });
  });

  it(`parses out-of-date error correctly`, () => {
    const errorString = JSON.stringify({
      symbol: `out-of-date`,
      content: `Some content`,
    });
    const result = parseError(errorString);
    expect(result).toEqual({
      symbol: `out-of-date`,
      content: `Some content`,
      message: `Some content`,
    });
  });

  it(`parses bad-request error correctly`, () => {
    const errorString = JSON.stringify({
      symbol: `bad-request`,
      content: `Some content`,
    });
    const result = parseError(errorString);
    expect(result).toEqual({
      symbol: `bad-request`,
      content: `Some content`,
      message: `Some content`,
    });
  });

  it(`returns unknown error for invalid JSON string`, () => {
    const result = parseError(`invalid JSON string`);
    expect(result).toEqual({
      symbol: `unknown`,
      content: `Unknown error occured`,
      message: `Unknown error occured`,
    });
  });

  it(`returns unknown error for non-string input (number)`, () => {
    const result = parseError(123);
    expect(result).toEqual({
      symbol: `unknown`,
      content: `Unknown error occured`,
      message: `Unknown error occured`,
    });
  });

  it(`returns unknown error for non-string input (object)`, () => {
    const result = parseError({ key: `value` });
    expect(result).toEqual({
      symbol: `unknown`,
      content: `Unknown error occured`,
      message: `Unknown error occured`,
    });
  });

  it(`returns unknown error for non-string input (array)`, () => {
    const result = parseError([1, 2, 3]);
    expect(result).toEqual({
      symbol: `unknown`,
      content: `Unknown error occured`,
      message: `Unknown error occured`,
    });
  });

  it(`returns unknown error for non-string input (boolean)`, () => {
    const result = parseError(true);
    expect(result).toEqual({
      symbol: `unknown`,
      content: `Unknown error occured`,
      message: `Unknown error occured`,
    });
  });

  it(`returns unknown error for missing symbol`, () => {
    const errorString = JSON.stringify({ content: `Some content` });
    const result = parseError(errorString);
    expect(result).toEqual({
      symbol: `unknown`,
      content: `Unknown error occured`,
      message: `Unknown error occured`,
    });
  });

  it(`returns unknown error for empty string`, () => {
    const result = parseError(``);
    expect(result).toEqual({
      symbol: `unknown`,
      content: `Unknown error occured`,
      message: `Unknown error occured`,
    });
  });

  it(`returns unknown error for malformed JSON`, () => {
    const result = parseError(
      `{"symbol": "internal", "content": "Some content"`,
    );
    expect(result).toEqual({
      symbol: `unknown`,
      content: `Unknown error occured`,
      message: `Unknown error occured`,
    });
  });

  it(`returns unknown error for valid JSON with missing content`, () => {
    const errorString = JSON.stringify({ symbol: `internal` });
    const result = parseError(errorString);
    expect(result).toEqual({
      symbol: `unknown`,
      content: `Unknown error occured`,
      message: `Unknown error occured`,
    });
  });

  it(`returns unknown error for valid JSON with additional properties`, () => {
    const errorString = JSON.stringify({
      symbol: `internal`,
      content: `Some content`,
      extra: `extra property`,
    });
    const result = parseError(errorString);
    expect(result).toEqual({
      symbol: `internal`,
      content: `Some content`,
      message: `Some content`,
    });
  });

  it(`returns unknown error when not supported symbol is returned`, () => {
    const errorString = JSON.stringify({
      symbol: `totally-unknown-random-symbol`,
      content: `Some content`,
    });
    const result = parseError(errorString);
    expect(result).toEqual({
      symbol: `unknown`,
      content: `Unknown error occured`,
      message: `Unknown error occured`,
    });
  });

  it(`returns unknown error when schema error has invalid shape`, () => {
    expect(
      parseError(
        JSON.stringify({
          symbol: `invalid-schema`,
          content: [],
        }),
      ),
    ).toEqual({
      symbol: `unknown`,
      content: `Unknown error occured`,
      message: `Unknown error occured`,
    });
    expect(
      parseError(
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
      message: `Unknown error occured`,
    });
    expect(
      parseError(
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
      message: `Unknown error occured`,
    });
  });
});
