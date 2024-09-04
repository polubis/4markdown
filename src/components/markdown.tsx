import React, { useState } from 'react';
import Md, { MarkdownToJSX } from 'markdown-to-jsx';
import { highlightElement } from 'prismjs';
import { Components } from '@mdx-js/react/lib';
import c from 'classnames';
import { Button } from 'design-system/button';
import { BiCheck, BiCopyAlt } from 'react-icons/bi';
import { useCopy } from 'development-kit/use-copy';
import { Tab, Tabs } from './tabs';

const Code = ({
  children,
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>) => {
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

const SnippetCopyButton = ({ children }: { children: React.ReactNode }) => {
  const [state, save] = useCopy();

  const copy = () => {
    save((children as React.ReactElement<{ children: string }>).props.children);
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

const OPTIONS: { overrides: Components; disableParsingRawHTML: boolean } = {
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
/* @TODO: Try to improve this typings here. */

const parseTabs = (text: string) => {
  const regex = /tab\[([^\]]+)\]\[([^\]]+)\]((?:.|[\r\n])*?)(?=(?:tab\[)|$)/g;
  const lines = text.split(`\n`);
  const tabs = [];
  let lastLine = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const label = match[1];
    const range = match[2];

    const [start, end] = range.split(`,`).map(Number);

    const indexOfEndCodeMarkdown = lines.findIndex((line) => line === `\`\`\``);
    const tabLines = lines.slice(0, indexOfEndCodeMarkdown);
    const content = tabLines.slice(start, end);
    tabs.push({
      label,
      content: `${
        content.length > 0
          ? `\`\`\`\n${content.join(`\n`)}\n\`\`\``
          : `No Content`
      }`,
      range,
    });

    lastLine = indexOfEndCodeMarkdown + 1;
    if (content.length === 0) return tabs;
  }

  if (lastLine < lines.length) {
    const remainingLines = lines.slice(lastLine).join(`\n`).trim();
    if (!tabs.length) return tabs;
    if (remainingLines) {
      tabs.push({
        label: `rest`,
        content: remainingLines,
        range: null,
      });
    }
  }

  return tabs;
};
interface MarkdownProps {
  children: string;
}

const Markdown: React.FC<MarkdownProps> = ({ children }) => {
  const [removedTabs, setRemovedTabs] = useState<string[]>([]);
  const tabSections = parseTabs(children);
  const filteredTabSections = tabSections.filter(
    (tab) => !removedTabs.includes(tab.label),
  );

  if (filteredTabSections.length > 0) {
    return (
      <Tabs>
        {filteredTabSections.map((tab, index) => (
          <Tab key={index} label={tab.label} setRemovedTabs={setRemovedTabs}>
            <div className="markdown">
              <Md
                options={OPTIONS as MarkdownToJSX.Options}
              >{`${tab.content}`}</Md>
            </div>
          </Tab>
        ))}
      </Tabs>
    );
  }

  return (
    <div className="markdown">
      <Md options={OPTIONS as MarkdownToJSX.Options}>{children}</Md>
    </div>
  );
};

export default Markdown;
