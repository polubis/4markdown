import { Button } from 'design-system/button';
import { Status } from 'design-system/status';
import { useCopy } from 'development-kit/use-copy';
import { useToggle } from 'development-kit/use-toggle';
import React from 'react';
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
} from 'react-icons/bi';

const CheatsheetModal = React.lazy(() =>
  import(`./cheatsheet-modal`).then((m) => ({
    default: m.CheatSheetModal,
  })),
);

type CreatorToolboxProps = {
  creator: HTMLTextAreaElement | null;
};

const CreatorToolbox = ({ creator }: CreatorToolboxProps) => {
  const [copyState, copy] = useCopy();
  const cheatsheetModal = useToggle();

  const insertMarkdownSyntax =
    (
      syntax:
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
        | `todo`,
    ) =>
    (): void => {
      if (!creator) return;

      const operationsMap: Record<typeof syntax, () => void> = {
        heading: () => {
          copy(`### `);
        },
        bold: () => {
          copy(`** **`);
        },
        italic: () => {
          copy(`* *`);
        },
        strike: () => {
          copy(`~~ ~~`);
        },
        quote: () => {
          copy(`> `);
        },
        code: () => {
          copy(`\`\`\`\n\n\`\`\``);
        },
        math: () => {
          copy(`$$\n\n$$`);
        },
        link: () => {
          copy(`![]()`);
        },
        ol: () => {
          copy(`1. \n2. \n3. `);
        },
        ul: () => {
          copy(`- \n- \n- `);
        },
        todo: () => {
          copy(`- [x] a\n- [ ] b\n- [x] c`);
        },
      };

      operationsMap[syntax]();
    };

  return (
    <>
      {copyState.is === `copied` && (
        <Status>Copied! Now put cursor in creator and paste</Status>
      )}
      {cheatsheetModal.opened && (
        <React.Suspense>
          <CheatsheetModal onClose={cheatsheetModal.close} />
        </React.Suspense>
      )}
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
        onClick={cheatsheetModal.open}
      >
        <BiInfoCircle size={20} />
      </Button>
    </>
  );
};

export { CreatorToolbox };
