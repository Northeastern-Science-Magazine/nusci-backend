import app from "./app/app.js";

/**
 * This file is the project entry point.
 */

const { SERVER_HOSTNAME, SERVER_PORT } = process.env;

app.listen({ port: SERVER_PORT, host: SERVER_HOSTNAME }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server running at ${address}`);
});