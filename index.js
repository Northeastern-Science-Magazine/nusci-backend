// express app
import app from "./app/app.js";

server.listen(SERVER_PORT, () => {
  console.log(`Server running at http://${SERVER_HOSTNAME}:${SERVER_PORT}/`);
});
