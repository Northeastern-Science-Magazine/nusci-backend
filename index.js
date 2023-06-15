import app from './api/app.js'
import 'dotenv/config'
import mongodb from 'mongodb'
import ArticlesAccessor from './api/database_accessor/articles_accessor.js'

/**
 * This file is the project entry point.
 */

const MongoClient = mongodb.MongoClient;
const mongo_username = process.env['MONGO_USERNAME'];
const mongo_password = process.env['MONGO_PASSWORD'];
const mongo_cluster = process.env['MONGO_CLUSTER'];
const uri = `mongodb+srv://${mongo_username}:${mongo_password}@${mongo_cluster}.xtdufxk.mongodb.net/?retryWrites=true&w=majority`;

const HOSTNAME = '0.0.0.0';
const PORT = 9998;

MongoClient.connect(
  uri,
  {
    maxPoolSize: 50,
    wtimeoutMS: 2500,
    useNewUrlParser: true
  }).catch(err => {
    console.error(err.stack)
    process.exit(1)
  }).then(async client => {
    await ArticlesAccessor.InjectDB(client);
    app.listen(PORT, () => {
      console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
    });
  })
