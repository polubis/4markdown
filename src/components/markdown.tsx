import React, {
  type ReactNode,
  type ReactElement,
  type HTMLAttributes,
  type DetailedHTMLProps,
  type JSX,
} from 'react';
import type { MarkdownToJSX } from 'markdown-to-jsx';
import Md from 'markdown-to-jsx';
import { highlightElement } from 'prismjs';
import c from 'classnames';
import { Button } from 'design-system/button';
import { BiCheck, BiCopyAlt } from 'react-icons/bi';
import { useCopy } from 'development-kit/use-copy';
import { interpret } from './interpret';

type MarkdownProps = {
  children: string;
};

type MarkdownOverrides = {
  [Key in keyof JSX.IntrinsicElements]?: (
    props: JSX.IntrinsicElements[Key],
  ) => JSX.Element;
} & Record<string, (props: any) => JSX.Element>;

type MarkdownOptions = Omit<MarkdownToJSX.Options, 'overrides'> & {
  overrides?: MarkdownOverrides;
};

const codeSettings = {
  topOffset: 4,
  lineHeight: 18,
};

const Code = ({
  children,
  className: command,
}: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>) => {
  const ref = React.useRef<HTMLElement | null>(null);

  const instructionMarkers = React.useMemo(() => {
    const instructions = interpret(command?.replace(`lang-`, ``));

    if (instructions.is === `failed`) return null;

    return (
      <div className="absolute">
        {instructions.a.map((line) => (
          <div
            key={`added(${line})`}
            style={{
              top: `${codeSettings.topOffset + (line - 1) * codeSettings.lineHeight}px`,
            }}
            className="absolute h-[18px] w-2.5 -left-[21.5px] bg-green-600 rounded-lg"
          />
        ))}
        {instructions.d.map((line) => (
          <div
            key={`deleted(${line})`}
            style={{
              top: `${codeSettings.topOffset + (line - 1) * codeSettings.lineHeight}px`,
            }}
            className="absolute h-[18px] w-2.5 top-[3px] -left-[21.5px] bg-red-600 rounded-lg"
          />
        ))}
        {instructions.e.map((line) => (
          <div
            key={`edited(${line})`}
            style={{
              top: `${codeSettings.topOffset + (line - 1) * codeSettings.lineHeight}px`,
            }}
            className="absolute h-[18px] w-2.5 top-[50px] -left-[21.5px] bg-yellow-600 rounded-lg"
          />
        ))}
      </div>
    );
  }, [command]);

  React.useLayoutEffect(() => {
    if (!ref.current) {
      throw Error(`Cannot highlight because there is a missing wrapper.`);
    }

    highlightElement(ref.current);
  }, [children]);

  return (
    <>
      {instructionMarkers}
      <code ref={ref} className="language-javascript">
        {children}
      </code>
    </>
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

  const copy = () => {
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

const options: MarkdownOptions = {
  disableParsingRawHTML: true,
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
        className={c(`text-md break-words text-justify md:text-left`, {
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
        className="text-md underline underline-offset-3 cursor-pointer break-words"
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
  },
};

const Markdown = ({ children }: MarkdownProps) => {
  return (
    <div className="markdown">
      <Md options={options}>{children}</Md>
    </div>
  );
};

export default Markdown;
