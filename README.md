<!-- TOC --><a name="documentation"></a>

# Documentation

This project has been established using an **open-source** template designed for the **Gatsby 5** ecosystem. You can find the template at: [Gatsby 5 Template + Tailwind + Zustand + TypeScript + Cypress + jest | rtl](https://github.com/polubis/Gatsby5-Tailwind-TypeScript-Cypress-jest-rtl-template).

<!-- TOC start (generated with https://github.com/derlin/bitdowntoc) -->

- [Documentation](#documentation)
  - [How to contribute?](#how-to-contribute)
  - [How to run the project?](#how-to-run-the-project)
  - [FAQ](#faq)
  - [Commands](#commands)
  - [Cheatsheet](#cheatsheet)
  - [Folders & Files structure](#folders-files-structure)
  - [Architecture](#architecture)
  - [Conventions](#conventions)

<!-- TOC end -->

<!-- TOC --><a name="how-to-contribute"></a>

## How to contribute?

Please contact [Adrian Połubiński](https://www.linkedin.com/in/adrian-po%C5%82ubi%C5%84ski-281ab2172/). He'll compile a list of available tickets for you to work on. We've opted to avoid raising issues on **GitHub** because of the significant time spent on maintenance.

> If you encounter a **bug**, **defect**, or have any **ideas for improvement** regarding [4markdown.com](https://4markdown.com/), please feel free to raise a **GitHub** issue. Your feedback is valuable to us!

Upon pushing a commit, you'll be seamlessly added to this [page](https://greenonsoftware.com/authors/) if you'd like! ヾ(≧▽≦\*)o

<!-- TOC --><a name="how-to-run-the-project"></a>

## How to run the project?

To set up `node` with the required version, you can utilize [nvm](https://github.com/nvm-sh/nvm).

Make sure you have the following versions installed:

- `node 18.18.0`
- `npm 8.11.0`

Once you have the required versions, execute `npm i`.

Before diving into **development**, you'll need to populate the `.env.development` file with necessary variables to facilitate project functionality:

```env
GATSBY_API_URL=
GATSBY_API_KEY=
GATSBY_AUTH_DOMAIN=
GATSBY_PROJECT_ID=
GATSBY_STORAGE_BUCKET=
GATSBY_MESSAGING_SENDER_ID=
GATSBY_APP_ID=
GATSBY_MEASUREMENT_ID=
```

Unfortunately, I cannot include them here. Please reach out to [Adrian Połubiński](https://www.linkedin.com/in/adrian-po%C5%82ubi%C5%84ski-281ab2172/) for assistance in setting up these variables.

To initiate the `development` server, input `npm run start`.

For generating a `production` build, execute `npm run build`.

<!-- TOC --><a name="faq"></a>

## FAQ

<!-- TOC --><a name="commands"></a>

## Commands

<!-- TOC --><a name="cheatsheet"></a>

## Cheatsheet

<!-- TOC --><a name="folders-files-structure"></a>

## Folders & Files structure

<!-- TOC --><a name="architecture"></a>

## Architecture

It's based on the following building blocks:

1. **Design system component**
   - Pure **UI** component, application agnostic, f.e `Button` or `Modal`
2. **Component**
   - Application specific, f.e `UsersList` or `PostsTable`
   - Design system component (app agnostic), f.e `Modal` or `Button`
3. **Container**
   - Contains connection to application **store**
   - Triggers **actions** and injects data from **store**
4. **View**
   - **Facade** to application route. Groups all components
5. **Page**
   - May be `static`
   - May be `dynamic`
   - Injects **framework** related data to **views**, it may be data from file system, or build time API requests
6. **Store**
   - The place where app related state is stored and maintained
   - Contains logic for **API** requests and handles app transactions, f.e call to **API** and change state
7. **Service**
   - Groups and maintains **backend API** logic
8. **Queries**
   - **Gatsby framework** related file system and data calls, f.e reading metadata from `json` files in `public` directory and passing it through component `props`
9. **Repository**
   - A `facade` that allows to read and maintain `local storage` and other browser related `API's` for data management and storage

The architecture graph looks as follows when we include hierarchies:

<!-- TOC --><a name="conventions"></a>

## Conventions
