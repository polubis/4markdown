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
import { extractTextFromNode, generateId } from '../hooks/useTableContent';

const Code = ({
  children,
}: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>) => {
  const ref = React.useRef<HTMLElement | null>(null);

  React.useLayoutEffect(() => {
    const container = ref.current;
    container && highlightElement(container);
  }, [children]);

  return (
    <code ref={ref} className="language-javascript">
      {children}
    </code>
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

// Helper function to extract text from ReactNode

const OPTIONS: Options = {
  remarkPlugins: [remarkGfm, remarkMath],
  rehypePlugins: [rehypeKatex],
  components: {
    h1: ({ children, ...props }) => {
      const text = extractTextFromNode(children);
      return (
        <h1 id={generateId(text)} {...props}>
          {children}
        </h1>
      );
    },
    h2: ({ children, ...props }) => {
      const text = extractTextFromNode(children);
      return (
        <h2 id={generateId(text)} {...props}>
          {children}
        </h2>
      );
    },
    h3: ({ children, ...props }) => {
      const text = extractTextFromNode(children);
      return (
        <h3 id={generateId(text)} {...props}>
          {children}
        </h3>
      );
    },
    h4: ({ children, ...props }) => {
      const text = extractTextFromNode(children);
      return (
        <h4 id={generateId(text)} {...props}>
          {children}
        </h4>
      );
    },
    h5: ({ children, ...props }) => {
      const text = extractTextFromNode(children);
      return (
        <h5 id={generateId(text)} {...props}>
          {children}
        </h5>
      );
    },
    h6: ({ children, ...props }) => {
      const text = extractTextFromNode(children);
      return (
        <h6 id={generateId(text)} {...props}>
          {children}
        </h6>
      );
    },
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
