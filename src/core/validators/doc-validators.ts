import {
  ValidatorsSetup,
  isString,
  maxLength,
  minLength,
  name,
  noEdgeSpaces,
} from 'development-kit/form';
import { Doc } from 'models/doc';

const baseSchemas = {
  name: [isString, name, minLength(2), maxLength(25), noEdgeSpaces],
} satisfies ValidatorsSetup<Doc>;

const createDocSchema: Required<ValidatorsSetup<Pick<Doc, 'name'>>> = {
  name: baseSchemas.name,
};

export { createDocSchema };
