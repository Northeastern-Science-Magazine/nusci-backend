//Entry point file. Getting an endpoint from app
import app from './api/server.js';

const HOSTNAME = '0.0.0.0';
const PORT = 9999;

app.listen(PORT, HOSTNAME, () => {
  console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
});