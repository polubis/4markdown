import { validator } from "./core";

export const minLength = (limit: number) =>
  validator(`minLength`, (value: string | unknown[]) => value.length >= limit);

export const maxLength = (limit: number) =>
  validator(`maxLength`, (value: string | unknown[]) => value.length <= limit);

export const min = (limit: number) =>
  validator(`min`, (value: number) => value >= limit);

export const max = (limit: number) =>
  validator(`max`, (value: number) => value <= limit);

export const url = validator(`url`, (value: string) =>
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/.test(
    value,
  ),
);
