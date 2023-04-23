//Entry point file. Getting an endpoint from app
import app from './api/app.js';

/* We're gonna importing MongoDB and accessing it here with
ENVIRONMENT VARIABLES !!!! YAy
  */

const HOSTNAME = '0.0.0.0';
const PORT = 9999;

app.listen(PORT, HOSTNAME, () => {
  console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
});