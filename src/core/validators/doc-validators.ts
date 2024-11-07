import type { PermanentDocumentDto } from 'api-4markdown-contracts';
import {
  type ValidatorsSetup,
  maxLength,
  minLength,
  minWords,
  validator,
} from 'development-kit/form';

const baseSchemas = {
  name: [minLength(1), maxLength(160)],
  description: [minLength(50), maxLength(250)],
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
  Pick<PermanentDocumentDto, 'name' | 'description'> & { tags: string }
>;

const permamentDocNameSchema = [...baseSchemas.name, minWords(3)];

const updateDocNameSchema: Required<
  ValidatorsSetup<Pick<PermanentDocumentDto, 'name'>>
> = {
  name: baseSchemas.name,
};

const updatePermamentDocNameSchema: Required<
  ValidatorsSetup<Pick<PermanentDocumentDto, 'name'>>
> = {
  name: permamentDocNameSchema,
};

const makeDocPermamentSchema: Required<
  ValidatorsSetup<
    Pick<PermanentDocumentDto, 'name' | 'description'> & { tags: string }
  >
> = {
  name: permamentDocNameSchema,
  description: baseSchemas.description,
  tags: baseSchemas.tags,
};

export {
  makeDocPermamentSchema,
  updateDocNameSchema,
  updatePermamentDocNameSchema,
};
