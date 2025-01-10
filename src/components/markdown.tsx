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
import 'prismjs/themes/prism-okaidia.css';

const Code = ({
  children,
}: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>) => {
  const ref = React.useRef<HTMLElement | null>(null);

  React.useLayoutEffect(() => {
    if (!ref.current) {
      throw Error(`Cannot highlight because there is a missing wrapper`);
    }

    highlightElement(ref.current);
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

const getSyntax = (syntax: unknown): string | undefined => {
  if (Array.isArray(syntax) && typeof syntax[0] === `string`) {
    return syntax[0].trim();
  }
};

const MathBlock = ({ children }: { children: unknown }) => {
  const syntax = getSyntax(children);

  if (syntax) {
    return (
      <p
        className="flex justify-center"
        dangerouslySetInnerHTML={{
          __html: katex.renderToString(syntax, {
            throwOnError: false,
            displayMode: true,
          }),
        }}
      />
    );
  }
};

const InlineMath = ({ children }: { children: unknown }) => {
  const syntax = getSyntax(children);

  if (syntax) {
    return (
      <span
        dangerouslySetInnerHTML={{
          __html: katex.renderToString(syntax, {
            throwOnError: false,
            displayMode: false,
          }),
        }}
      />
    );
  }
};

const OPTIONS: MarkdownToJSX.Options = {
  disableParsingRawHTML: false,
  overrides: {
    a: ({ children, href }) => (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
    code: Code,
    pre: ({ children }) => (
      <div className="relative group">
        <SnippetCopyButton>{children}</SnippetCopyButton>
        <pre>{children}</pre>
      </div>
    ),
    math: MathBlock,
    mathInline: InlineMath,
  },
};

type MarkdownProps = {
  className?: string;
  children: string;
};

const preprocessMath = (markdown: string): string =>
  markdown
    .replace(/\$\$([\s\S]+?)\$\$/g, `<math>$1</math>`)
    .replace(/\$([^$]+)\$/g, `<mathInline>$1</mathInline>`);

const M = ({ children }: Pick<MarkdownProps, 'children'>) => {
  return (
    <MarkdownRenderer options={OPTIONS}>
      {preprocessMath(children)}
    </MarkdownRenderer>
  );
};

M.className = `markdown [&_.katex-error]:!text-red-600 dark:[&_.katex-error]:!text-red-400`;

const Markdown = ({ className, children }: MarkdownProps) => {
  return (
    <div className={c(M.className, className)}>
      <M>{preprocessMath(children)}</M>
    </div>
  );
};

export { Markdown, M };
