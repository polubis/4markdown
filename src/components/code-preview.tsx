import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { okaidia } from '@uiw/codemirror-theme-okaidia';

const extensions = [
  javascript({ jsx: true }), // Add cursor visibility option to remove the cursor
];

type CodePreviewProps = {
  children: string;
};

const CodePreview = ({ children }: CodePreviewProps) => {
  return (
    <CodeMirror
      value={children}
      theme={okaidia}
      readOnly
      extensions={extensions}
    />
  );
};

export { CodePreview };
