## How to Contribute?

1. Share your GitHub username with [Adrian Połubiński](https://www.linkedin.com/in/adrian-po%C5%82ubi%C5%84ski-281ab2172/).
2. Once added to the board and repo, pick a ticket.
3. Assign it to yourself and move it to `in progress`.
4. Always create a branch from `develop`, our default branch (`main` is for production).
5. After completing your work, raise a PR and link it to the ticket in the comments.
6. Include the ticket link in the PR description as well.
7. Move the ticket to `in review`.
8. Assign the PR to [Adrian Połubiński](https://www.linkedin.com/in/adrian-po%C5%82ubi%C5%84ski-281ab2172/) for code review.
9. If approved, testers (`MajaWielechowska` or `KaminskiKrzysztof`) will be assigned. If not, you'll need to make the necessary fixes.
10. After testing, testers will comment on the results.
11. If everything is fine, assign the ticket back to [Adrian Połubiński](https://www.linkedin.com/in/adrian-po%C5%82ubi%C5%84ski-281ab2172/).
12. Once code review is complete, your part is done—[Adrian Połubiński](https://www.linkedin.com/in/adrian-po%C5%82ubi%C5%84ski-281ab2172/) will handle the merging.

> Contact [Adrian Połubiński](https://www.linkedin.com/in/adrian-po%C5%82ubi%C5%84ski-281ab2172/) if you need assistance.

## How to Run the Project?

To set up the required Node.js version, use [nvm](https://github.com/nvm-sh/nvm).

Ensure you have the following versions installed:

- `node 18.18.0`
- `npm 8.11.0`

Once installed, run `npm i --legacy-peer-deps`.

Before starting development, populate the `.env.development` file with the necessary variables:

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

For these variables, please contact [Adrian Połubiński](https://www.linkedin.com/in/adrian-po%C5%82ubi%C5%84ski-281ab2172/).

To start the development server, run `npm run start`.

For a production build, run `npm run build`.

To run unit tests, use `npm run test:watch`.
