import React, {
  type ReactNode,
  type HTMLAttributes,
  type DetailedHTMLProps,
  type ReactElement,
} from 'react';
import { highlightElement } from 'prismjs';
import c from 'classnames';
import type { ButtonProps } from 'design-system/button';
import { Button } from 'design-system/button';
import { BiCheck, BiCopyAlt } from 'react-icons/bi';
import { useCopy } from 'development-kit/use-copy';
import ReactMarkdown, { type Options } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Tabs } from 'design-system/tabs';

const useTab = (children: ReactNode) => {
  const [activeTab, setActiveTab] = React.useState<number>(0);

  const content = React.useMemo(() => children?.toString() || ``, [children]);
  const hasTabs = content.includes(`@@@`);

  const parseTabContent = React.useCallback((content: string): string[] => {
    const panels = content.split(`@@@`);
    return panels[0].trim() === `` ? panels.slice(1) : panels;
  }, []);

  const tabs = React.useMemo(
    () => (hasTabs ? parseTabContent(content) : []),
    [hasTabs, content, parseTabContent],
  );

  return {
    activeTab,
    setActiveTab,
    hasTabs,
    content,
    tabs,
  };
};

type TabCodeProps = {
  tabs: string[];
  activeTab: number;
  setActiveTab: React.Dispatch<React.SetStateAction<number>>;
};

const TabCode = ({ tabs, activeTab, setActiveTab }: TabCodeProps) => {
  return (
    <>
      <Tabs fit>
        {tabs.map((_, index) => (
          <Tabs.Item
            active={activeTab === index}
            key={index}
            onClick={() => setActiveTab(index)}
          >
            {`Tab ${index + 1}`}
          </Tabs.Item>
        ))}
      </Tabs>
      {tabs.map((tab, index) => (
        <code
          key={index}
          ref={(el) => {
            if (index === activeTab && el) {
              highlightElement(el);
            }
          }}
          className={c(`language-javascript`, index !== activeTab && `hidden`)}
        >
          {tab}
        </code>
      ))}
    </>
  );
};

const Code = ({
  children,
}: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>) => {
  const ref = React.useRef<HTMLElement | null>(null);
  const { hasTabs, tabs, activeTab, setActiveTab } = useTab(children);

  React.useLayoutEffect(() => {
    const container = ref.current;
    if (container && !hasTabs) {
      highlightElement(container);
    }
  }, [children, hasTabs]);

  if (!hasTabs) {
    return (
      <code ref={ref} className="language-javascript">
        {children}
      </code>
    );
  }

  return (
    <TabCode tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
  );
};

const SnippetCopyButton = ({ children }: { children: ReactNode }) => {
  const [state, save] = useCopy();

  const copy: ButtonProps['onClick'] = (e) => {
    e.stopPropagation();
    save((children as ReactElement<{ children: string }>).props.children);
  };

  return (
    <Button
      className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity z-10"
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

const OPTIONS: Options = {
  remarkPlugins: [remarkGfm, remarkMath],
  rehypePlugins: [rehypeKatex],
  components: {
    a: ({ children, href }) => (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
    img: ({ src, alt }) => <img loading="lazy" src={src} alt={alt} />,
    code: Code,
    pre: ({ children }) => (
      <div className="relative group">
        <SnippetCopyButton>{children}</SnippetCopyButton>
        <pre>{children}</pre>
      </div>
    ),
  },
};

type MarkdownProps = {
  className?: string;
  children: string;
};

const Markdown = ({ className, children }: MarkdownProps) => {
  return (
    <ReactMarkdown
      className={c(
        `prose dark:prose-invert [&_.katex-error]:!text-red-600 dark:[&_.katex-error]:!text-red-400`,
        className,
      )}
      {...OPTIONS}
    >
      {children}
    </ReactMarkdown>
  );
};

export { Markdown };
