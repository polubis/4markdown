import {
  maxLength,
  minLength,
  name,
  noEdgeSpaces,
  optional,
  url,
} from 'development-kit/form';

const nodeName = [noEdgeSpaces, minLength(2), maxLength(100), name];
const nodeDescription = [optional(noEdgeSpaces, maxLength(250))];
const nodeUrl = [noEdgeSpaces, url];

export { nodeName, nodeDescription, nodeUrl };
