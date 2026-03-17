import { ImageDto } from "api-4markdown-contracts";

const extensions: ImageDto["extension"][] = [
  `png`,
  `jpeg`,
  `jpg`,
  `gif`,
  `webp`,
];
const contentTypes: ImageDto["contentType"][] = [
  `image/png`,
  `image/jpeg`,
  `image/jpg`,
  `image/gif`,
  `image/webp`,
];

const generateMockAsset = (index: number): ImageDto => {
  const extensionIndex = index % extensions.length;
  const extension = extensions[extensionIndex];
  const contentType = contentTypes[extensionIndex];

  return {
    id: `mock-asset-${index}` as ImageDto["id"],
    extension,
    contentType,
    url: `https://picsum.photos/seed/${index}/400/300` as ImageDto["url"],
  };
};

const generateMockAssets = (
  count: number,
  startIndex: number = 0,
): ImageDto[] => {
  return Array.from({ length: count }, (_, i) =>
    generateMockAsset(startIndex + i),
  );
};

export { generateMockAssets };
