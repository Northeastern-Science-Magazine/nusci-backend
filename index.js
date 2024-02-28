import app from "./api/app.js";

/**
 * This file is the project entry point.
 */

const HOSTNAME = "0.0.0.0";
const PORT = 9998;

app.listen(PORT, () => {
  console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
});
