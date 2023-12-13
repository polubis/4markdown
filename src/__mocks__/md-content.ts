const MD_CONTENT = `# Siema 
dasdsas asadsa a
dsad asdsa sasa sad
## Siema
dasdsas asadsa a
dsad asdsa sasa sad
### Siema
dasdsas asadsa a
dsad asdsa sasa sad
#### Siema dasdad *dasdad*
dasdsas asadsa a
dsad asdsa sasa sad _**~~Scratch this.~~**_
##### Siema
dasdsas asadsa a
dsad asdsa sasa sad
###### Siema
dasdsas asadsa a
dsad asdsa sasa sad
> Blockquotes are very handy in email to emulate reply text.
> This line is part of the same quote.
Quote break.
[I'm an inline-style link](https://www.google.com)
[I'm an inline-style link with title](https://www.google.com "Google's Homepage")
[I'm a relative reference to a repository file](../blob/master/LICENSE)
[You can use numbers for reference-style link definitions][1]
URLs and URLs in angle brackets will automatically get turned into links. 
http://www.example.com or <http://www.example.com> and sometimes 
example.com (but not on Github, for example).
Some text to show that the reference links can follow later.
[arbitrary case-insensitive reference text]: https://www.mozilla.org
[1]: http://slashdot.org
[link text itself]: http://www.reddit.com
dasda ddasa ssd Inline-style: ![alt text](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Logo Title Text 1") 
dasd dasds sdadd sadad asds ad **sss** _dsadasd_.
- First item *dasdasd* dadasd _adasd_
1. adsada
- irst item *dasdasd* dadasd _adasd_
1. adsada [jamjam](https://jamjambeings.com) 
2. adsada [jamjam](https://jamjambeings.com) 
- irst item *dasdasd* dadasd _adasd_
1. irst item *dasdasd* dadasd _adasd_
- irst item *dasdasd* dadasd _adasd_
- irst item *dasdasd* dadasd _adasd_
2. irst item *dasdasd* dadasd _adasd_
3. irst item *dasdasd* dadasd _adasd_
\`\`\`javascript
import React from 'react'
overrides: {
  h1: ({ children }) => <h1 className="text-6xl font-bold">{children}</h1>,
  h2: ({ children }) => <h2 className="text-5xl font-bold">{children}</h2>,
  h3: ({ children }) => <h3 className="text-4xl font-bold">{children}</h3>,
  h4: ({ children }) => <h4 className="text-3xl font-bold">{children}</h4>,
  h5: ({ children }) => <h5 className="text-2xl font-bold">{children}</h5>,
  h6: ({ children }) => <h6 className="text-xl font-bold">{children}</h6>,
  p: ({ children }) => <p className="text-xl text-justify">{children}</p>,
  em: ({ children }) => <em className="font-thin">{children}</em>,
  strong: ({ children }) => <strong className="font-bold">{children}</strong>,
  ul: ({ children }) => <ul>{children}</ul>,
  ol: ({ children }) => <ol>{children}</ol>,
  li: ({ children }) => <li className="text-xl">{children}</li>,
  del: ({ children }) => <del>{children}</del>,
\`\`\`
Inline \`npm i --legacy-peer-deps\` has \`const a = 1 \` it.
\`\`\`javascript
import React from 'react'
Inline \`code\` has \`back-ticks around\` it.
overrides: {
  h1: ({ children }) => <h1 className="text-6xl font-bold">{children}</h1>,
  h2: ({ children }) => <h2 className="text-5xl font-bold">{children}</h2>,
  h3: ({ children }) => <h3 className="text-4xl font-bold">{children}</h3>,
  h4: ({ children }) => <h4 className="text-3xl font-bold">{children}</h4>,
  h5: ({ children }) => <h5 className="text-2xl font-bold">{children}</h5>,
  h6: ({ children }) => <h6 className="text-xl font-bold">{children}</h6>,
  p: ({ children }) => <p className="text-xl text-justify">{children}</p>,
  em: ({ children }) => <em className="font-thin">{children}</em>,
  strong: ({ children }) => <strong className="font-bold">{children}</strong>,
  ul: ({ children }) => <ul>{children}</ul>,
  ol: ({ children }) => <ol>{children}</ol>,
  li: ({ children }) => <li className="text-xl">{children}</li>,
  del: ({ children }) => <del>{children}</del>,
\`\`\`
![My image description](https://img.freepik.com/premium-wektory/dobry-widok-na-gory-grafika-ilustracja-projekt-koszulki-wektor-sztuki_24519-2593.jpg?w=2000)
*my description of image!*
1. First second
2. Second
- something
- something
1. dadassddd
| Tables        | Are           | Cool  | Tables        | Are           | Cool  | Tables        | Are           | Cool  | Tables        | Are           | Cool  | 
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
1 | 2 | 3
`;

const MD_CONTENT_ADV = `# 1

This is the paragraph

\`\`\`javascript
const a = 'Thanks for using our editor!'
\`\`\`

## 2

This is the paragraph

### 3

This is the paragraph

#### 4

This is the paragraph

##### 5

This is the paragraph

###### 6

This is the paragraph

![Alt of image](https://img.freepik.com/premium-wektory/dobry-widok-na-gory-grafika-ilustracja-projekt-koszulki-wektor-sztuki_24519-2593.jpg?w=2000)
*Description of image!*

Colons can be used to align columns.

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
1 | 2 | 3
`;

export { MD_CONTENT, MD_CONTENT_ADV };
