import React from 'react';
import type { HeadFC } from 'gatsby';
import LogoThumbnail from 'images/logo-thumbnail.png';
import Meta from 'components/meta';
import { meta } from '../../meta';

import Markdown from 'markdown-to-jsx';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  jsx,
  typescript,
  python,
  bash,
  markdown,
} from 'react-syntax-highlighter/dist/esm/languages/prism';

// Register languages
SyntaxHighlighter.registerLanguage(`jsx`, jsx);
SyntaxHighlighter.registerLanguage(`typescript`, typescript);
SyntaxHighlighter.registerLanguage(`python`, python);
SyntaxHighlighter.registerLanguage(`bash`, bash);
SyntaxHighlighter.registerLanguage(`markdown`, markdown);

// Custom Code block component
const CodeBlock = ({ className, children }) => {
  // Extract language from className (format: "lang-javascript")
  const language = className ? className.replace(`lang-`, ``) : `text`;

  return (
    <div className="rounded-lg overflow-hidden my-4">
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        showLineNumbers={true}
        wrapLines={true}
        customStyle={{
          margin: 0,
          borderRadius: `0.5rem`,
          fontSize: `14px`,
        }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
};

// Custom overrides for markdown-to-jsx
const markdownOverrides = {
  code: {
    component: CodeBlock,
  },
  pre: {
    component: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
  h1: {
    component: ({ children }) => (
      <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>
    ),
  },
  h2: {
    component: ({ children }) => (
      <h2 className="text-2xl font-semibold mt-6 mb-3">{children}</h2>
    ),
  },
  p: {
    component: ({ children }) => (
      <p className="my-4 leading-relaxed">{children}</p>
    ),
  },
};

const MarkdownRenderer = ({ content }) => {
  return (
    <div className="prose prose-invert max-w-none">
      <Markdown
        options={{
          overrides: markdownOverrides,
          forceBlock: true,
        }}
      >
        {content}
      </Markdown>
    </div>
  );
};

// Example usage component
const ExampleUsage = () => {
  const markdownContent = `
# Welcome to Markdown with Syntax Highlighting

Here's some example code in different languages:

## TypeScript Example

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email?: string;
}

const getUser = async (id: number): Promise<User> => {
  const response = await fetch(\`/api/users/\${id}\`);
  return response.json();
};
\`\`\`

## Python Example

\`\`\`python
from typing import Optional

class User:
    def __init__(self, name: str, email: Optional[str] = None):
        self.name = name
        self.email = email
    
    def greet(self) -> str:
        return f"Hello, {self.name}!"
\`\`\`

## React JSX Example

\`\`\`jsx
function Welcome({ name }) {
  return (
    <div className="greeting">
      <h1>Hello, {name}!</h1>
      <p>Welcome to our application.</p>
    </div>
  );
}
\`\`\`
`;

  return (
    <div className="p-6 bg-gray-900 text-gray-100">
      <MarkdownRenderer content={markdownContent} />
    </div>
  );
};

const SandboxPage = () => {
  return <></>;
};

export default SandboxPage;

export const Head: HeadFC = () => {
  return (
    <Meta
      appName={meta.appName}
      title="Sandbox"
      description="Sandbox for playing with any kind of components"
      url={meta.siteUrl + meta.routes.sandbox}
      lang={meta.lang}
      image={meta.siteUrl + LogoThumbnail}
      robots="noindex, nofollow"
    />
  );
};
