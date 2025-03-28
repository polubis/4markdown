import { type ReactNode } from 'react';

export const generateHeadingId = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, ``)
    .replace(/\s+/g, `-`)
    .replace(/-+/g, `-`);
};

export const generateHeadingTitle = (text: string): string => {
  return text
    .replace(/\*\*(.*?)\*\*/g, `$1`)
    .replace(/\*(.*?)\*/g, `$1`)
    .replace(/`(.*?)`/g, `$1`)
    .replace(/\[(.*?)\]\(.*?\)/g, `$1`)
    .trim();
};

export const getTextFromChildren = (children: ReactNode): string => {
  if (typeof children === `string`) return children;
  if (Array.isArray(children)) {
    return children
      .map((child) => {
        if (typeof child === `string`) return child;
        if (child && typeof child === `object` && `props` in child) {
          return getTextFromChildren(child.props.children);
        }
        return ``;
      })
      .join(``);
  }
  if (children && typeof children === `object` && `props` in children) {
    return getTextFromChildren(children.props.children);
  }
  return ``;
};
