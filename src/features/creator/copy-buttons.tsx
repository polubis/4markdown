import React from 'react';
import { BiCode, BiHeading, BiImage, BiLink, BiTable } from 'react-icons/bi';
import { Button } from 'design-system/button';
import { useCopy } from 'development-kit/use-copy';

const Code = () => {
  const [state, copy] = useCopy();

  return (
    <>
      <Button
        className="ml-2"
        i={2}
        rfull
        title="Copy code markdown"
        overlay={state.is === `copied` ? `Copied` : undefined}
        onClick={() => {
          copy(
            `\`\`\`javascript
const a = 'Thanks for using our editor!'
\`\`\``,
          );
        }}
      >
        <BiCode className="text-2xl" />
      </Button>
    </>
  );
};

const Headings = () => {
  const [state, copy] = useCopy();

  return (
    <>
      <Button
        i={2}
        rfull
        title="Copy headings markdown"
        overlay={state.is === `copied` ? `Copied` : undefined}
        onClick={() => {
          copy(`
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
      >
        <BiHeading className="text-2xl" />
      </Button>
    </>
  );
};

const Image = () => {
  const [state, copy] = useCopy();

  return (
    <>
      <Button
        className="ml-2"
        i={2}
        rfull
        title="Copy image markdown"
        overlay={state.is === `copied` ? `Copied` : undefined}
        onClick={() => {
          copy(
            `![Alt of image](https://img.freepik.com/premium-wektory/dobry-widok-na-gory-grafika-ilustracja-projekt-koszulki-wektor-sztuki_24519-2593.jpg?w=2000)
*Description of image!*`,
          );
        }}
      >
        <BiImage className="text-2xl" />
      </Button>
    </>
  );
};

const Table = () => {
  const [state, copy] = useCopy();

  return (
    <>
      <Button
        className="ml-2"
        i={2}
        rfull
        title="Copy table markdown"
        overlay={state.is === `copied` ? `Copied` : undefined}
        onClick={() => {
          copy(`Colons can be used to align columns.

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
      >
        <BiTable className="text-2xl" />
      </Button>
    </>
  );
};

const Link = () => {
  const [state, copy] = useCopy();

  return (
    <>
      <Button
        className="ml-2"
        i={2}
        rfull
        title="Copy link markdown"
        overlay={state.is === `copied` ? `Copied` : undefined}
        onClick={() => {
          copy(`[Label](URL)`);
        }}
      >
        <BiLink className="text-2xl" />
      </Button>
    </>
  );
};

export default {
  Table,
  Code,
  Image,
  Headings,
  Link,
};
