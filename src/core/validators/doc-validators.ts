import {
  ValidatorsSetup,
  isString,
  maxLength,
  minLength,
  minWords,
  name,
  noEdgeSpaces,
  validator,
} from 'development-kit/form';
import { PermanentDoc } from 'models/doc';

const baseSchemas = {
  name: [isString, name, minLength(2), maxLength(100), noEdgeSpaces],
  description: [isString, noEdgeSpaces, minLength(50), maxLength(250)],
  tags: [
    validator(`tags`, (value: string) => {
      if (typeof value !== `string` || value.length !== value.trim().length) {
        return false;
      }

      const splitted = value.split(`,`);

      return (
        splitted.length >= 1 &&
        splitted.length <= 10 &&
        splitted.length === new Set([...splitted]).size &&
        splitted.every(
          (tag) =>
            tag.length >= 2 && tag.length <= 50 && /^[a-zA-Z0-9,-]+$/.test(tag),
        )
      );
    }),
  ],
} satisfies ValidatorsSetup<
  Pick<PermanentDoc, 'name' | 'description'> & { tags: string }
>;

const createDocSchema: Required<ValidatorsSetup<Pick<PermanentDoc, 'name'>>> = {
  name: baseSchemas.name,
};

const makeDocPermamentSchema: Required<
  ValidatorsSetup<Pick<PermanentDoc, 'name' | 'description'> & { tags: string }>
> = {
  name: [...baseSchemas.name, minWords(3)],
  description: baseSchemas.description,
  tags: baseSchemas.tags,
};

export { createDocSchema, makeDocPermamentSchema };
