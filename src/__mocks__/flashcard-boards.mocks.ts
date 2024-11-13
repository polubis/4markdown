import type { FlashcardDto, FlashcardsBoardDto } from 'api-4markdown-contracts';

const FLASHCARDS: FlashcardDto[] = [
  {
    id: `1`,
    content: `# Flashcard Boards
  Using "flashcardsBoards" could still feel a bit confusing because it blends two nouns, each in the plural form, without clearly conveying the relationship between them. Since each **Board** is essentially a container for **Flashcards**, it's often clearer to separate these terms or use them in a way that implies this hierarchy.
  
  - **Flashcard Boards** – clarifies that these are boards of flashcards.
  - **Flashcards Hub** or **Flashcards Collection** – referring to an overarching feature containing multiple boards and flashcards.
  
  In short, **Flashcard Boards** (or similar terms) makes the structure and relationship more explicit and readable.`,
  },
  {
    id: `2`,
    content: `# Lorem Ipsum
  Lorem ipsum dolor sit amet, **consectetur adipiscing** elit. Sed do _eiusmod tempor_ incididunt ut labore et dolore magna aliqua.
  
  - Ut enim ad minim veniam
  - Quis nostrud exercitation ullamco
  - Laboris nisi ut aliquip ex ea commodo consequat
  
  In short, lorem ipsum is a **placeholder text** commonly used in the graphic, print, and publishing industries.`,
  },
  {
    id: `3`,
    content: `# Benefits of Markdown
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent **facilisis**, ipsum a tristique commodo, erat nisi tincidunt eros, a dictum ligula arcu at justo.
  
  - Markdown is *simple* to write and read
  - **Flexible** format, supporting text and code
  - Ideal for documentation and content creation
  
  In short, using Markdown helps maintain a **clean and organized** text format.`,
  },
  {
    id: `4`,
    content: `# Markdown Syntax Examples
  Here are some examples of basic Markdown syntax:
  
  - **Bold**: \`**Bold Text**\`
  - _Italic_: \`*Italic Text*\`
  - Inline \`code\`: \`console.log("Hello World");\`
    
  \`\`\`javascript
  // Code block example
  function greet() {
    console.log("Hello World");
  }
  \`\`\`
  
  Markdown is versatile for **formatting content** efficiently.`,
  },
  {
    id: `5`,
    content: `# The Importance of Documentation
  Good documentation is essential for **team collaboration** and long-term project success. It helps new team members understand the code and makes the project more **maintainable**.
  
  - Clear explanations help avoid **redundant questions**
  - Supports **scalability** by enabling smooth transitions
  - Serves as a reliable **reference**
  
  Remember, documentation is a **key part of development** and should not be overlooked.`,
  },
  {
    id: `6`,
    content: `# Git Basics
  Git is a **version control system** that allows teams to collaborate on code and track changes over time.
  
  - **Initialize** a repo: \`git init\`
  - **Add** changes: \`git add .\`
  - **Commit** changes: \`git commit -m "message"\`
  
  Using Git effectively can enhance **collaboration and project management** across development teams.`,
  },
  {
    id: `7`,
    content: `# Introduction to TypeScript
  TypeScript is a **typed superset** of JavaScript that compiles to plain JavaScript. It improves code quality by enforcing types.
  
  - Helps catch **type errors** during development
  - Offers **better tooling** and **autocompletion**
  - Enhances **readability** of complex codebases
  
  Adopting TypeScript can result in fewer bugs and a more **maintainable codebase**.`,
  },
  {
    id: `8`,
    content: `# CSS Flexbox Basics
  Flexbox is a layout model that enables responsive **design structures**.
  
  - Define a flex container: \`display: flex;\`
  - Align items: \`align-items: center;\`
  - Justify content: \`justify-content: space-between;\`
  
  Using Flexbox makes it easier to create **adaptive and visually appealing layouts**.`,
  },
  {
    id: `9`,
    content: `# JavaScript Promises
  Promises in JavaScript represent the **future result** of an asynchronous operation.
  
  - Create a promise: \`new Promise((resolve, reject) => {...})\`
  - Resolve or reject: \`.then()\` or \`.catch()\`
  - Chain promises for **sequential operations**
  
  Promises simplify async code and make it **more readable**.`,
  },
  {
    id: `10`,
    content: `# REST API Basics
  A REST API allows for communication between a **client** and a **server** using HTTP requests.
  
  - Common methods: **GET**, **POST**, **PUT**, **DELETE**
  - Each request is **stateless** and self-contained
  - Follows principles of **scalability** and **simplicity**
  
  REST APIs are a popular choice for creating **web services** and enabling **client-server interactions**.`,
  },
];

const FLASHCARD_BOARDS: FlashcardsBoardDto[] = [
  {
    id: `1`,
    name: `My private flashcards board`,
    visibility: `private`,
    flashcards: [...FLASHCARDS].slice(3),
  },
  {
    id: `2`,
    name: `My public flashcards board`,
    visibility: `public`,
    flashcards: FLASHCARDS,
  },
  {
    id: `3`,
    name: `My permanent flashcards board`,
    visibility: `permanent`,
    description: `This is the description for my permanent board`,
    flashcards: [...FLASHCARDS].slice(6),
  },
];

export { FLASHCARD_BOARDS };
