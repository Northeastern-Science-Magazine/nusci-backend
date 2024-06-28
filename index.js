import app from "./app/app.js";

/**
 * This file is the project entry point.
 */

const { SERVER_HOSTNAME, SERVER_PORT } = process.env;

app.listen(SERVER_PORT, () => {
  console.log(`Server running at http://${SERVER_HOSTNAME}:${SERVER_PORT}/`);
});
