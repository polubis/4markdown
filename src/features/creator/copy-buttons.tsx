import React from 'react';
import { BiCode, BiHeading, BiImage, BiLink, BiTable } from 'react-icons/bi';
import { Button } from 'design-system/button';
import type { IconType } from 'react-icons';

interface BaseButtonProps {
  icon: IconType;
  title: string;
  onClick(): void;
}

interface CopyButtonProps {
  onClick(content: string): void;
}

const CopyButton = ({ onClick, title, icon: Icon }: BaseButtonProps) => {
  return (
    <Button i={2} rfull title={title} onClick={onClick}>
      <Icon className="text-2xl" />
    </Button>
  );
};

const Code = ({ onClick }: CopyButtonProps) => {
  return (
    <CopyButton
      title="Copy code markdown"
      icon={BiCode}
      onClick={() => {
        onClick(
          `\`\`\`javascript
const a = 'Thanks for using our editor!'
\`\`\``,
        );
      }}
    />
  );
};

const Headings = ({ onClick }: CopyButtonProps) => {
  return (
    <CopyButton
      title="Copy headings markdown"
      icon={BiHeading}
      onClick={() => {
        onClick(`
# 1

1

## 2

2

### 3

3

#### 4

4

##### 5

5

###### 6

6
`);
      }}
    />
  );
};

const Image = ({ onClick }: CopyButtonProps) => {
  return (
    <CopyButton
      title="Copy image markdown"
      icon={BiImage}
      onClick={() => {
        onClick(
          `![Alt of image](https://img.freepik.com/premium-wektory/dobry-widok-na-gory-grafika-ilustracja-projekt-koszulki-wektor-sztuki_24519-2593.jpg?w=2000)
*Description of image!*`,
        );
      }}
    />
  );
};

const Table = ({ onClick }: CopyButtonProps) => {
  return (
    <CopyButton
      title="Copy table markdown"
      icon={BiTable}
      onClick={() => {
        onClick(`Colons can be used to align columns.

| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |

There must be at least 3 dashes separating each header cell.
The outer pipes (|) are optional, and you don't need to make the 
raw Markdown line up prettily. You can also use inline Markdown.

Markdown | Less | Pretty
--- | --- | ---
*Still* | \`renders\` | **nicely**
1 | 2 | 3`);
      }}
    />
  );
};

const Link = ({ onClick }: CopyButtonProps) => {
  return (
    <CopyButton
      icon={BiLink}
      title="Copy link markdown"
      onClick={() => {
        onClick(`[Label](URL)`);
      }}
    />
  );
};

export default {
  Table,
  Code,
  Image,
  Headings,
  Link,
};
