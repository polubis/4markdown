import type {
  FlashcardDto,
  FlashcardsBoardDto,
  PrivateFlashcardsBoardDto,
} from 'api-4markdown-contracts';

const FLASHCARDS: FlashcardDto[] = [
  {
    id: `1`,
    content: `# Flashcard Boards Explained
  "Flashcard Boards" can sometimes seem ambiguous since it combines two plural nouns. To clarify the relationship, consider that each **Board** holds a collection of **Flashcards**.

  - **Flashcard Boards** – implies these are boards filled with flashcards.
  - **Flashcards Hub** or **Flashcards Collection** – if representing a larger feature containing multiple boards.

  In essence, using a structured term like **Flashcard Boards** makes the organizational hierarchy clear.`,
  },
  {
    id: `2`,
    content: `# What is Lorem Ipsum?
  Lorem ipsum is a common placeholder text in the design world, used to fill space when the final content isn't yet available.

  - **Origins**: Derived from "De finibus bonorum et malorum" by Cicero.
  - **Usage**: Helps visualize layout without meaningful content.

  Lorem ipsum is essential for **mock-ups** and **prototypes** as it prevents distraction from design elements.`,
  },
  {
    id: `3`,
    content: `# Benefits of Markdown for Developers
  Markdown provides a straightforward way to create formatted documents with simple syntax.

  - Markdown is *easy* to write and read.
  - **Flexible** format that supports both text and code.
  - Works great for documentation and **quick notes**.

  Markdown helps developers **maintain clean and organized content** across projects.`,
  },
  {
    id: `4`,
    content: `# Markdown Syntax Overview
  Key Markdown syntax that developers find useful:

  - **Bold**: \`**Bold Text**\`
  - *Italic*: \`*Italic Text*\`
  - Inline code example: \`console.log("Hello Markdown");\`
  
  \`\`\`javascript
  // JavaScript code block example
  function greet() {
    console.log("Hello, Markdown!");
  }
  \`\`\`

  Markdown is versatile and effective for **project documentation** and **technical writing**.`,
  },
  {
    id: `5`,
    content: `# Documentation Importance in Development
  Good documentation fosters collaboration and long-term success in projects. 

  - **Avoids redundant questions** by providing clarity.
  - Supports **team scaling** by easing new members in.
  - Acts as a **long-term reference** for project nuances.

  Documentation is a crucial part of development and should be prioritized from the start.`,
  },
  {
    id: `6`,
    content: `# Git Basics for Collaboration
  Git is a **version control system** that enables developers to track and manage code changes effectively.

  - Initialize a repo: \`git init\`
  - Stage changes: \`git add .\`
  - Commit changes: \`git commit -m "commit message"\`

  Effective use of Git helps in **team collaboration** and prevents **code conflicts**.`,
  },
  {
    id: `7`,
    content: `# Introduction to TypeScript
  TypeScript, a superset of JavaScript, introduces types for **better error handling** and code quality.

  - Prevents **type errors** during development.
  - Enhances **tooling** with autocomplete and better hints.
  - Helps in making **large codebases more readable**.

  Adopting TypeScript can result in **fewer bugs** and better **maintainability** over time.`,
  },
  {
    id: `8`,
    content: `# CSS Flexbox Fundamentals
  Flexbox provides a **flexible layout structure** for creating responsive and adaptive designs.

  - Define a container: \`display: flex;\`
  - Center items: \`align-items: center;\`
  - Space elements: \`justify-content: space-between;\`

  Flexbox enables **efficient design control** across various screen sizes and devices.`,
  },
  {
    id: `9`,
    content: `# JavaScript Promises in Action
  Promises represent a **future value** from asynchronous code, helping handle operations that don’t resolve immediately.

  - Create a promise: \`new Promise((resolve, reject) => {...})\`
  - Handle success or failure: \`.then()\` or \`.catch()\`
  - Chain promises for **sequence of tasks**

  Promises improve async code readability and structure, especially in complex applications.`,
  },
  {
    id: `10`,
    content: `# REST API Essentials
  REST APIs facilitate communication between a **client** and a **server** using HTTP requests.

  - Methods: **GET**, **POST**, **PUT**, **DELETE**
  - Statelessness – each request is independent.
  - Scalable and simple for various web interactions.

  REST APIs are essential for **client-server applications** and enabling **interoperability** across platforms.`,
  },
];

const PRIVATE_FLASHCARDS_BOARD: PrivateFlashcardsBoardDto = {
  id: `1`,
  name: `Developer Concepts`,
  cdate: `2024-11-18T13:45:00.563Z`,
  mdate: `2024-11-18T13:45:00.563Z`,
  visibility: `private`,
  description: null,
  flashcards: [FLASHCARDS[4], FLASHCARDS[6], FLASHCARDS[9]],
};

const FLASHCARD_BOARDS: FlashcardsBoardDto[] = [
  PRIVATE_FLASHCARDS_BOARD,
  {
    id: `2`,
    name: `Web Design Essentials`,
    cdate: `2024-11-18T13:45:00.563Z`,
    mdate: `2024-11-18T13:45:00.563Z`,
    visibility: `public`,
    description: null,
    flashcards: [FLASHCARDS[3], FLASHCARDS[5], FLASHCARDS[7]],
  },
  {
    id: `3`,
    name: `Markdown and Text Formatting`,
    cdate: `2024-11-18T13:45:00.563Z`,
    mdate: `2024-11-18T13:45:00.563Z`,
    visibility: `permanent`,
    description: `A permanent board dedicated to learning Markdown syntax and its applications for developers and writers.`,
    flashcards: [...FLASHCARDS].slice(3),
  },
  {
    id: `4`,
    name: `JavaScript Asynchronous Programming`,
    cdate: `2024-11-18T13:45:00.563Z`,
    mdate: `2024-11-18T13:45:00.563Z`,
    visibility: `permanent`,
    description: `This permanent board covers asynchronous programming in JavaScript, with a focus on Promises and their use cases.`,
    flashcards: [...FLASHCARDS].slice(3, 8),
  },
];

export { FLASHCARDS, FLASHCARD_BOARDS, PRIVATE_FLASHCARDS_BOARD };
