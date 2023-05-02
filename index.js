//Entry point file. Getting an endpoint from app
import app from './api/app.js'

//import mongodb from 'mongodb'

//const MongoClient = mongodb.MongoClient;
//const mongo_username = proccess.env('MONGO_USERNAME');
//const mongo_password = proccess.env('MONGO_PASSWORD');
//const mongo_cluster = proccess.env('MONGO_CLUSTER');
//const uri = ``;

const HOSTNAME = '0.0.0.0';
const PORT = 9998;

app.listen(PORT, HOSTNAME, () => {
  console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
});