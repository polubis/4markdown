import React from 'react';
import CodeMirror, { type Extension } from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { vscodeDark, vscodeDarkInit } from '@uiw/codemirror-theme-vscode';
import { python } from '@codemirror/lang-python';
import { markdown } from '@codemirror/lang-markdown';

type Language = `javascript` | `typescript` | `markdown` | `python`;

type CodePreviewProps = {
  language: Language;
  children: string;
};

const getLanguageMode = (language: Language): Extension => {
  switch (language) {
    case `python`:
      return python();
    case `typescript`:
      return javascript({ typescript: true });
    case `markdown`:
      return markdown();
    case `javascript`:
      return javascript();
    default:
      throw Error(`Language parameter is required`);
  }
};

const CodePreview = ({ language, children }: CodePreviewProps) => {
  const extensions = React.useMemo(
    () => [vscodeDark, getLanguageMode(language)],
    [language],
  );

  return (
    <CodeMirror
      value={children.trimEnd()}
      theme={vscodeDarkInit()}
      readOnly
      extensions={extensions}
    />
  );
};

export { CodePreview };
