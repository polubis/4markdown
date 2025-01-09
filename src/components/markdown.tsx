import React, {
  type ReactNode,
  type HTMLAttributes,
  type DetailedHTMLProps,
  type ReactElement,
} from 'react';
import type { MarkdownToJSX } from 'markdown-to-jsx';
import MarkdownRenderer from 'markdown-to-jsx';
import { highlightElement } from 'prismjs';
import c from 'classnames';
import type { ButtonProps } from 'design-system/button';
import { Button } from 'design-system/button';
import { BiCheck, BiCopyAlt } from 'react-icons/bi';
import { useCopy } from 'development-kit/use-copy';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import ErrorBoundary from 'development-kit/error-boundary';

const Code = ({
  children,
}: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>) => {
  const ref = React.useRef<HTMLElement | null>(null);

  React.useLayoutEffect(() => {
    if (!ref.current) {
      throw Error(`Cannot highlight because there is a missing wrapper.`);
    }

    highlightElement(ref.current);
  }, [children]);

  return (
    <code ref={ref} className="language-javascript">
      {children}
    </code>
  );
};

const isReactElement = (
  node: unknown,
): node is ReactElement<unknown, () => ReactNode> =>
  typeof node === `object` && node !== null && !!(node as ReactElement).type;

const isDescribedImage = (nodes: ReactNode): boolean => {
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

const SnippetCopyButton = ({ children }: { children: ReactNode }) => {
  const [state, save] = useCopy();

  const copy: ButtonProps['onClick'] = (e) => {
    e.stopPropagation();
    save((children as ReactElement<{ children: string }>).props.children);
  };

  return (
    <Button
      className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity"
      i={2}
      s={1}
      title="Copy snippet"
      onClick={copy}
    >
      {state.is === `copied` ? (
        <BiCheck className="text-green-700" />
      ) : (
        <BiCopyAlt />
      )}
    </Button>
  );
};

const MathBlock = ({ children }: { children: string[] }) => {
  const latexCode = children[0]?.trim();

  return (
    <ErrorBoundary fallback={() => null}>
      <div
        dangerouslySetInnerHTML={{
          __html: katex.renderToString(latexCode, { throwOnError: false }),
        }}
      />
    </ErrorBoundary>
  );
};

const OPTIONS: MarkdownToJSX.Options = {
  disableParsingRawHTML: false,
  overrides: {
    h1: ({ children }) => (
      <h1 className="text-5xl break-words pb-3">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-4xl break-words pb-1">{children}</h2>
    ),
    h3: ({ children }) => <h3 className="text-3xl break-words">{children}</h3>,
    h4: ({ children }) => <h4 className="text-2xl break-words">{children}</h4>,
    h5: ({ children }) => <h5 className="text-xl break-words">{children}</h5>,
    h6: ({ children }) => <h6 className="text-lg break-words">{children}</h6>,
    p: ({ children }) => (
      <p
        className={c(`break-words text-justify md:text-left`, {
          'flex flex-col': isDescribedImage(children),
        })}
      >
        {children}
      </p>
    ),
    em: ({ children }) => <em>{children}</em>,
    strong: ({ children }) => <strong>{children}</strong>,
    ul: ({ children }) => <ul>{children}</ul>,
    ol: ({ children }) => <ol>{children}</ol>,
    li: ({ children }) => <li>{children}</li>,
    del: ({ children }) => <del>{children}</del>,
    a: ({ children, href }) => (
      <a
        className="underline underline-offset-3 cursor-pointer break-words"
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
    td: ({ children }) => <td className="text-center px-2 py-2">{children}</td>,
    th: ({ children }) => <th className="px-2 py-2">{children}</th>,
    blockquote: ({ children }) => (
      <blockquote className="px-3 py-2 border-l-4">{children}</blockquote>
    ),
    pre: ({ children }) => (
      <div className="relative border-zinc-300 bg-zinc-100 dark:border-zinc-700 dark:bg-gray-950 border-2 rounded-md group">
        <SnippetCopyButton>{children}</SnippetCopyButton>
        <pre className="p-4">{children}</pre>
      </div>
    ),
    $$: () => <div className="bg-red-400">siema</div>,
    math: ({ children }) => <MathBlock>{children}</MathBlock>,
    mathInline: () => <div className="bg-red-400">siema</div>,
  },
};

type MarkdownProps = {
  className?: string;
  children: string;
};

const M = ({ children }: Pick<MarkdownProps, 'children'>) => {
  return <MarkdownRenderer options={OPTIONS}>{children}</MarkdownRenderer>;
};

M.className = `markdown`;

const Markdown = ({ className, children }: MarkdownProps) => {
  return (
    <div className={c(M.className, className)}>
      <M>{children}</M>
    </div>
  );
};

export { Markdown, M };
