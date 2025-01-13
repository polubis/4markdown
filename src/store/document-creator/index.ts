/* eslint-disable no-useless-escape */
import { state } from 'development-kit/state';
import type { DocumentCreatorState } from './models';
import { meta } from '../../../meta';

const initialCode = `# Markdown Cheatsheet

Supporting [GitHub](https://github.com) flavored syntax 100% 💥💚 (I hope). If you encounter any issues, please contact us at our [LinkedIn](${meta.linkedInUrl}).

The editor works really well with the [Grammarly Extension](${meta.grammarlyUrl}) for grammar. I recommend giving it a try.

## Typography

1. **Separate sections** with \`enter\` (line breaks)
2. To create different **headings**, use the \`#\` symbol. To determine size, use **"#, ##, ###, ####, #####"** or **"######"**
3. Use different text formatters
   1. **Bold** - Wrap text with \*\*content here\*\*
   2. *Italics* - Wrap text with \*content here\*
   3. ***Bold and Italics*** - Wrap text with \*\*\*content here\*\*\*
   4. \`const a = 5\` - Wrap inline code with \`inline code here\`
   5. ~~Strikethrough~~ - Wrap text with \~\~content here\~\~
   6. $overline{x} = \frac{1}{n}\left(\sum_{i=1}^{n}{x_{i}}\right)$ - Wrap math syntax with \$overline{x} = \frac{1}{n}\left(\sum_{i=1}^{n}{x_{i}}\right)\$
   7. [Website link](${meta.siteUrl}) - Use following syntax **\[title\]\(link\)**.
4. Be careful to avoid unnecessary whitespace characters. These may cause content to display incorrectly
5. If you want to escape parsing, use **"\\"** before the symbol. For example, to disable parsing a heading, use **"\\#"**. This applies to other symbols as well

## Lists

1. You can use three types of lists: **ordered**, **unordered**, and **todo lists**

\`\`\`
// @@@ Ordered
1. First
2. Second
// @@@ Unordered
- First
- Second
// @@@ Todo list
- [x] First
- [ ] Second
// or
1. [x] First
2. [ ] Second // [space] is important!!!
\`\`\`

2. **Nesting** and **mixing** can be applied by adding a **tab** or **three spaces** before each level

\`\`\`
1. First level
   - Child 1
   - Child 2
   - [x] Child 3
   - [ ] Child 4
2. Second level
    1. Child 2.1
    2. Child 2.2
\`\`\`

## Blocks

1. To render a block of code, you need to use **\`\`\`block code goes here\`\`\`**. Remember to add **\`\`\`**\`enter\`**\`\`\`** between the blocks

\`\`\`
The comments marker "//" is added to allow the display of "\`\`\`" in the snippet. 
Normally, you don't need this

\`\`\`
const a = 5;

if (a > 5) return;
//\`\`\` 
\`\`\`

2. To render math syntax in a block, you need to use **\$\$math syntax goes here\$\$**. Remember to add a line break, as you would in the **block of code** case

\`\`\`
$$
overline{x} = \frac{1}{n}\left(\sum_{i=1}^{n}{x_{i}}\right)
$$
\`\`\`

and it provides you with

$$
overline{x} = \frac{1}{n}\left(\sum_{i=1}^{n}{x_{i}}\right)
$$

3. To render a **table**, use the following syntax (all typography elements can be used inside)

\`\`\`
| Name        | Age | Country    | Occupation     |
|-------------|-----|------------|----------------|
| John Doe    | 29  | **USA**        | Software Dev   |
| Jane Smith  | 34  | ~~Canada~~     | Graphic Designer|
| Mike Johnson| 42  | UK         | Product Manager|
| Emily White | 25  | *Australia*  | Data Analyst   |
| Sam Brown   | 37  | \`Germany\`    | Project Lead   |
\`\`\`

and it provides you with

| Name        | Age | Country    | Occupation     |
|-------------|-----|------------|----------------|
| John Doe    | 29  | **USA**       | Software Dev   |
| Jane Smith  | 34  | ~~Canada~~     | Graphic Designer|
| Mike Johnson| 42  | UK         | Product Manager|
| Emily White | 25  | *Australia*  | Data Analyst   |
| Sam Brown   | 37  | \`Germany\`    | Project Lead   |

4. To render an image, you can use the \`![alt](url)*description*\` syntax. The **description** is optional

\`\`\`
![image alt](image url) // Add here enter for better formatting
*description* // Description is optional
\`\`\`

and it gives you

![Application logo](/logo-thumbnail.webp)
*Application logo*

5. To display a quote, use the **"\> quote sentence"** syntax. It will give you:

> The best developers understand the value of pair programming.

## Thanks for using our editor!

Like our [LinkedIn](${meta.linkedInUrl}) profile or join [Discord](${meta.discordUrl}) channel. In addition, we're working on other applications and we have an education platform that creates content for free - [${meta.company}](${meta.companyUrl})! 

Any suggestions, comments, or ideas for improvement? Feel free to join our [Discord](${meta.discordUrl}) or add info on [LinkedIn](${meta.linkedInUrl}) profile. If you want to contribute, here you have a repository: [${meta.appName} repository](${meta.sourceCodeUrl}).
`;

const useDocumentCreatorState = state<DocumentCreatorState>({
  initialCode,
  code: initialCode,
  changed: false,
});

export { useDocumentCreatorState };
