import React from "react";
import { Button } from "design-system/button";
import {
  BiBold,
  BiCode,
  BiHeading,
  BiInfoCircle,
  BiItalic,
  BiLink,
  BiListCheck,
  BiListOl,
  BiListUl,
  BiMath,
  BiSolidQuoteAltLeft,
  BiStrikethrough,
} from "react-icons/bi";

type CreatorToolboxSyntaxKey =
  | `heading`
  | `bold`
  | `italic`
  | `strike`
  | `quote`
  | `code`
  | `math`
  | `link`
  | `ol`
  | `ul`
  | `todo`;

type CreatorToolboxProps = {
  creator: HTMLTextAreaElement | null;
  onClick(syntax: string | null): void;
};

const CreatorToolbox = ({ creator, onClick }: CreatorToolboxProps) => {
  const insertMarkdownSyntax =
    (syntaxKey: CreatorToolboxSyntaxKey) => (): void => {
      if (!creator) return;

      const operationsMap: Record<CreatorToolboxSyntaxKey, () => void> = {
        heading: () => {
          onClick(`### `);
        },
        bold: () => {
          onClick(`** **`);
        },
        italic: () => {
          onClick(`* *`);
        },
        strike: () => {
          onClick(`~~ ~~`);
        },
        quote: () => {
          onClick(`> `);
        },
        code: () => {
          onClick(`\`\`\`\n\n\`\`\``);
        },
        math: () => {
          onClick(`$$\n\n$$`);
        },
        link: () => {
          onClick(`![]()`);
        },
        ol: () => {
          onClick(`1. \n2. \n3. `);
        },
        ul: () => {
          onClick(`- \n- \n- `);
        },
        todo: () => {
          onClick(`- [x] a\n- [ ] b\n- [x] c`);
        },
      };

      operationsMap[syntaxKey]();
    };

  return (
    <>
      <Button
        s="auto"
        className="p-1"
        i={1}
        title="Heading"
        onClick={insertMarkdownSyntax(`heading`)}
      >
        <BiHeading size={20} />
      </Button>
      <Button
        s="auto"
        className="p-1"
        i={1}
        title="Bold"
        onClick={insertMarkdownSyntax(`bold`)}
      >
        <BiBold size={20} />
      </Button>
      <Button
        s="auto"
        className="p-1"
        i={1}
        title="Italic"
        onClick={insertMarkdownSyntax(`italic`)}
      >
        <BiItalic size={20} />
      </Button>
      <Button
        s="auto"
        className="p-1"
        i={1}
        title="Quote"
        onClick={insertMarkdownSyntax(`quote`)}
      >
        <BiSolidQuoteAltLeft size={20} />
      </Button>
      <Button
        s="auto"
        className="p-1"
        i={1}
        title="Striketrough"
        onClick={insertMarkdownSyntax(`strike`)}
      >
        <BiStrikethrough size={20} />
      </Button>
      <Button
        s="auto"
        className="p-1"
        i={1}
        title="Code"
        onClick={insertMarkdownSyntax(`code`)}
      >
        <BiCode size={20} />
      </Button>
      <Button
        s="auto"
        className="p-1"
        i={1}
        title="Math / Latex syntax"
        onClick={insertMarkdownSyntax(`math`)}
      >
        <BiMath size={20} />
      </Button>
      <Button
        s="auto"
        className="p-1"
        i={1}
        title="Link"
        onClick={insertMarkdownSyntax(`link`)}
      >
        <BiLink size={20} />
      </Button>
      <Button
        s="auto"
        className="p-1"
        i={1}
        title="Ordered list"
        onClick={insertMarkdownSyntax(`ol`)}
      >
        <BiListOl size={20} />
      </Button>
      <Button
        s="auto"
        className="p-1"
        i={1}
        title="Unordered list"
        onClick={insertMarkdownSyntax(`ul`)}
      >
        <BiListUl size={20} />
      </Button>
      <Button
        s="auto"
        className="p-1"
        i={1}
        title="Task list"
        onClick={insertMarkdownSyntax(`todo`)}
      >
        <BiListCheck size={20} />
      </Button>
      <Button
        s="auto"
        className="p-1"
        i={1}
        title="Cheatsheet"
        onClick={() => onClick(null)}
      >
        <BiInfoCircle size={20} />
      </Button>
    </>
  );
};

export type { CreatorToolboxProps };
export { CreatorToolbox };
