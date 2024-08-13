import { meta } from './meta';

const createInitialCode = (): string => `# Markdown Cheatsheet

Separate every paragraph/section of text with \`enter\`. Suppose you want to create bolding use **bolding**. The _italic_ text requires a "_" symbol. 

It works great with the [Grammarly Chrome Extension](${meta.grammarlyUrl}) - this is for people who don't know **English** language well as me 🤝. 

To dive deeper through editor features watch the following [Video](${meta.ytVideoTutorialUrl}) on our [YouTube channel](${meta.ytChannelUrl}).

## How to add inline code?

To add inline code use the "\`" symbol to wrap concrete text. For example:

\`const a = 5\`. Remember to use escape characters like *"/"* to type symbols that are used for markdown creation. 

### Additional information

We're supporting most of the **Markdown** tags, however, some of them may not work correctly. In this case, remember to inform us on our [LinkedIn](${meta.linkedInUrl}) profile or [Discord](${meta.discordUrl}) channel. 

#### How to create a table?

| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |

#### How to add a block quote?

> That's the additional information to display in the block quote.

#### How to create a code snippet?

The code snippet in \`JavaScript\`.

\`\`\`javascript
const a = 5;
const b = 10;

const add = () => {
   return a + b;
}
\`\`\`

#### How to add an image or links?

![Alt of image](/icons/icon-256x256.png)
*${meta.title}*

##### If you enjoyed this editor

Like our [LinkedIn](${meta.linkedInUrl}) profile or join [Discord](${meta.discordUrl}) channel. In addition, we're working on other applications and we have an education platform that creates content for free - [${meta.company}](${meta.companyUrl})! 

###### Thanks for using our editor!

Any suggestions, comments, or ideas for improvement? Feel free to join our [Discord](${meta.discordUrl}) or add info on [LinkedIn](${meta.linkedInUrl}) profile. If you want to contribute, here you have a repository: [${meta.appName} repository](${meta.sourceCodeUrl}).`;

export { createInitialCode };
