import { validator } from './core';

export const minLength = (limit: number) =>
  validator(`minLength`, (value: string | unknown[]) => value.length >= limit);

export const maxLength = (limit: number) =>
  validator(`maxLength`, (value: string | unknown[]) => value.length <= limit);

export const min = (limit: number) =>
  validator(`min`, (value: number) => value >= limit);

export const max = (limit: number) =>
  validator(`max`, (value: number) => value <= limit);

export const noEdgeSpaces = validator(
  `noEdgeSpaces`,
  (value: string) => value.trim().length === value.length,
);

export const notEmpty = validator(
  `notEmpty`,
  (value: string) => value.trim().length > 0,
);

export const url = validator(`url`, (value: string) =>
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/.test(
    value,
  ),
);

export const nickname = validator(`nickname`, (value: string) =>
  /^[a-zA-Z0-9_-]+$/.test(value),
);

export const base64Blob = validator(`base64Blob`, (value: string) =>
  /^\s*data:([a-zA-Z]+\/[a-zA-Z]+)?(;base64)?,[a-zA-Z0-9+/]+={0,2}\s*$/.test(
    value,
  ),
);
