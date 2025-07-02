import type { ParsedError } from "api-4markdown-contracts";
import { parseError } from "../parse-error";
import { expect } from "@jest/globals";

describe(`Error parsing works when`, () => {
	const verifyErrorShape = (
		incoming: ParsedError,
		expected: ParsedError,
	): void => {
		expect(parseError(Error(JSON.stringify(incoming)))).toEqual(expected);
	};

	it(`parses already-exists error`, () => {
		verifyErrorShape(
			{
				symbol: `already-exists`,
				content: `Some content`,
				message: `Some content`,
			},
			{
				symbol: `already-exists`,
				content: `Some content`,
				message: `Some content`,
			},
		);
	});

	it(`parses unauthenticated error`, () => {
		verifyErrorShape(
			{
				symbol: `unauthenticated`,
				content: `Some content`,
				message: `Some content`,
			},
			{
				symbol: `unauthenticated`,
				content: `Some content`,
				message: `Some content`,
			},
		);
	});

	it(`parses internal error`, () => {
		verifyErrorShape(
			{
				symbol: `internal`,
				content: `Some content`,
				message: `Some content`,
			},
			{
				symbol: `internal`,
				content: `Some content`,
				message: `Some content`,
			},
		);
	});

	it(`parses invalid-schema error`, () => {
		verifyErrorShape(
			{
				symbol: `invalid-schema`,
				content: [{ key: `key1`, message: `Some message` }],
				message: `Some message`,
			},
			{
				symbol: `invalid-schema`,
				content: [{ key: `key1`, message: `Some message` }],
				message: `Some message`,
			},
		);
	});

	it(`parses not-found error`, () => {
		verifyErrorShape(
			{
				symbol: `not-found`,
				content: `Some content`,
				message: `Some content`,
			},
			{
				symbol: `not-found`,
				content: `Some content`,
				message: `Some content`,
			},
		);
	});

	it(`parses out-of-date error`, () => {
		verifyErrorShape(
			{
				symbol: `out-of-date`,
				content: `Some content`,
				message: `Some content`,
			},
			{
				symbol: `out-of-date`,
				content: `Some content`,
				message: `Some content`,
			},
		);
	});

	it(`parses bad-request error`, () => {
		verifyErrorShape(
			{
				symbol: `bad-request`,
				content: `Some content`,
				message: `Some content`,
			},
			{
				symbol: `bad-request`,
				content: `Some content`,
				message: `Some content`,
			},
		);
	});

	it(`returns unknown error for invalid JSON string`, () => {
		expect(parseError(`invalid JSON string`)).toEqual({
			symbol: `unknown`,
			content: `Unknown error occured`,
			message: `Unknown error occured`,
		});
	});

	it(`returns unknown error for non-string input (number)`, () => {
		expect(parseError(123)).toEqual({
			symbol: `unknown`,
			content: `Unknown error occured`,
			message: `Unknown error occured`,
		});
	});

	it(`returns unknown error for non-string input (object)`, () => {
		expect(parseError({ key: `value` })).toEqual({
			symbol: `unknown`,
			content: `Unknown error occured`,
			message: `Unknown error occured`,
		});
	});

	it(`returns unknown error for non-string input (array)`, () => {
		expect(parseError([1, 2, 3])).toEqual({
			symbol: `unknown`,
			content: `Unknown error occured`,
			message: `Unknown error occured`,
		});
	});

	it(`returns unknown error for non-string input (boolean)`, () => {
		expect(parseError(true)).toEqual({
			symbol: `unknown`,
			content: `Unknown error occured`,
			message: `Unknown error occured`,
		});
	});

	it(`returns unknown error for missing symbol`, () => {
		expect(parseError(JSON.stringify({ content: `Some content` }))).toEqual({
			symbol: `unknown`,
			content: `Unknown error occured`,
			message: `Unknown error occured`,
		});
	});

	it(`returns unknown error for empty string`, () => {
		expect(parseError(``)).toEqual({
			symbol: `unknown`,
			content: `Unknown error occured`,
			message: `Unknown error occured`,
		});
	});

	it(`returns unknown error for malformed JSON`, () => {
		expect(
			parseError(`{"symbol": "internal", "content": "Some content"`),
		).toEqual({
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

	it(`ignores additional properties`, () => {
		verifyErrorShape(
			{
				symbol: `internal`,
				content: `Some content`,
				extra: `extra property`,
				message: `Some content`,
			} as any,
			{
				symbol: `internal`,
				content: `Some content`,
				message: `Some content`,
				extra: `extra property`,
			} as any,
		);
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
