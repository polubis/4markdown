1. Testy wizualne komponentów w izolacji za pomocą Storybook oraz Chromatic -> https://greenonsoftware.com/articles/testing/chromatic-and-storybook/

2. Przemyślenia na temat pokrycia kodu -> https://4markdown.com/reflections-on-test-coverage-in-web-development/

3. Kurs z testowania -> https://greenonsoftware.com/courses/react-testing-spellbook/

4. Chromatic showcase -> https://www.chromatic.com/test?appId=6463b9b3f6a12b651e1706cb&id=6571a275b79425b690768515

5. Gherkin i interpreter artykul -> https://4markdown.com/why-i-crafted-my-own-gherkin-interpreter-for-e2e-tests/

6. UI lib -> https://github.com/polubis/Dream-stack-for-React-dev/tree/main/system/libs/figa-ui

7. Repo i kod z prezki -> https://github.com/polubis/4markdown/tree/prezka-przeprogramowani

## Użyteczne prompty

- Analiza zachowań do przetestowania

```
Under @perfect-test.md  I've added an example of testing pattern I'm using in my codebase. List behaviors to test from @cookies.ts
```

- Generowanie testów e2e

```
@commands.ts contains list of commands to run via syntax provided in @log-in-out.cy.ts .

I want to have a new e2e test (only one "it" statement), for checking feature of adding new document.

Use only available commands from @commands.ts and craft me e2e for:

Sign in
Close user details popup
Opens create document popup
Closing it and checking if it's closed
Open popup again
Check if button (confirm) is initially disabled
Touch input and type some document name ("My Notes, Basics of Computer Science, ...etc" - placeholder)
See if button is enabled
Confirm document creation
Check if button is disabled
Check if popup is closed
```
