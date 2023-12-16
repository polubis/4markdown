import React from 'react';
import Md, { MarkdownToJSX } from 'markdown-to-jsx';
import { highlightElement } from 'prismjs';
import { Components } from '@mdx-js/react/lib';
import c from 'classnames';

const Code = ({
  className = `language-javascript`,
  children,
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>) => {
  const ref = React.useRef<HTMLElement | null>(null);

  React.useLayoutEffect(() => {
    if (!ref.current) {
      throw Error(`Cannot highlight because there is a missing wrapper.`);
    }

    highlightElement(ref.current);
  }, [children, className]);

  return (
    <code ref={ref} className={className}>
      {children}
    </code>
  );
};

const isReactElement = (
  node: unknown,
): node is React.ReactElement<unknown, () => React.ReactNode> =>
  typeof node === `object` &&
  node !== null &&
  !!(node as React.ReactElement).type;

const isDescribedImage = (nodes: React.ReactNode): boolean => {
  if (!Array.isArray(nodes)) {
    return false;
  }

  const img = nodes[0];
  const em = nodes[2];

  if (!isReactElement(img) || !isReactElement(em)) {
    return false;
  }

  return img.type.name === `img` && em.type.name === `em`;
};

const OPTIONS: { overrides: Components; disableParsingRawHTML: boolean } = {
  disableParsingRawHTML: true,
  overrides: {
    h1: ({ children }) => (
      <h1 className="text-6xl border-b-2 pb-5 border-zinc-300 dark:border-zinc-800">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-5xl border-b-2 pb-5 border-zinc-300 dark:border-zinc-800">
        {children}
      </h2>
    ),
    h3: ({ children }) => <h3 className="text-4xl">{children}</h3>,
    h4: ({ children }) => <h4 className="text-3xl">{children}</h4>,
    h5: ({ children }) => <h5 className="text-2xl">{children}</h5>,
    h6: ({ children }) => <h6 className="text-xl">{children}</h6>,
    p: ({ children }) => (
      <p
        className={c(`text-md text-justify`, {
          'flex flex-col': isDescribedImage(children),
        })}
      >
        {children}
      </p>
    ),
    em: ({ children }) => <em className="font-thin">{children}</em>,
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    ul: ({ children }) => <ul>{children}</ul>,
    ol: ({ children }) => <ol>{children}</ol>,
    li: ({ children }) => <li className="text-xl">{children}</li>,
    del: ({ children }) => <del>{children}</del>,
    a: ({ children, href }) => (
      <a
        className="text-md underline underline-offset-3 cursor-pointer"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
    img: ({ src, alt }) => (
      <picture>
        {/* @TODO: Think about showing different size of images. */}
        <img loading="lazy" className="max-w-[100%]" src={src} alt={alt} />
      </picture>
    ),
    table: ({ children }) => (
      <table className="max-w-[100%] w-[max-content] border-spacing-0 border-collapse overflow-auto block">
        {children}
      </table>
    ),
    code: Code,
    td: ({ children }) => (
      <td className="text-base text-center px-2 py-2">{children}</td>
    ),
    th: ({ children }) => (
      <th className="text-base text-center px-2 py-2">{children}</th>
    ),
    blockquote: ({ children }) => (
      <blockquote className="px-3 py-2 border-l-4">{children}</blockquote>
    ),
    pre: ({ children }) => <pre className="px-3 py-4">{children}</pre>,
  },
};
/* @TODO: Try to improve this typings here. */

interface MarkdownProps {
  children: string;
}

const Markdown: React.FC<MarkdownProps> = ({ children }) => {
  return (
    <div className="markdown">
      <Md options={OPTIONS as MarkdownToJSX.Options}>{children}</Md>
    </div>
  );
};

export default Markdown;
