import { onRequest } from 'firebase-functions/v2/https';
// import * as logger from 'firebase-functions/logger';
import { initializeApp, auth } from 'firebase-admin';

initializeApp();

export const createMdFile = onRequest(async (request, response) => {
  //   logger.info('Hello logs!', { structuredData: true });
  //   response.send('Hello from Firebase!');
  // Check if the request includes a valid Firebase ID token
  const { authorization } = request.headers;

  if (!authorization || !authorization.startsWith(`Bearer `)) {
    response.status(401).send(`Unauthorized`);
    return;
  }

  const idToken = authorization.split(`Bearer `)[1];

  try {
    const decodedToken = await auth().verifyIdToken(idToken);

    if (decodedToken.email_verified) {
      response.status(200).send(`Authorized`);
    } else {
      response.status(401).send(`Forbidden`);
    }
  } catch (error) {
    console.error(`Error during ID token verification:`, error);
    response.status(500).send(`Internal Server Error`);
  }
});
