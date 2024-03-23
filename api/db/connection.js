import { config as dotenvConfig } from "dotenv";
import mongoose from "mongoose"; // import mongoose
import { log } from "mercedlogger";

//Map of all connections to the databases
let connections = new Map();

/**
 * Connection Class
 *
 * This class controls connections to the MongoDB Cluster.
 *
 */
export default class Connection {
  /**
   * open Method
   *
   * Establishes a connection to the given database within
   * the cluster.
   *
   * Static - no instance required.
   * Async - promises to return the correct data.
   *
   * @param {String} db Database name to connect to
   * @returns the connection object
   */
  static async open(db) {
    if (!connections.get(db)) {
      //Load Environment variables
      dotenvConfig();

      //Destructure variables
      const { MONGO_USERNAME, MONGO_PASSWORD, MONGO_CLUSTER } = process.env;
      const DATABASE_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_CLUSTER}.xtdufxk.mongodb.net/?retryWrites=true&w=majority`;

      //Mongoose connect to the database.
      mongoose.connect(DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 50,
        socketTimeoutMS: 2500,
        dbName: db,
      });

      connections.set(db, mongoose.connection);

      //Log when open/closed
      mongoose.connection
        .on("open", () => log.green("DATABASE STATE", "Connection Open"))
        .on("close", () => log.magenta("DATABASE STATE", "Connection Closed"))
        .on("error", (error) => log.red("DATABASE STATE", error));

      return mongoose.connection;
    } else {
      return connections.get(db);
    }
  }

  /**
   * close Method
   *
   * This method closes the given MongoDB connection.
   *
   * Static - no instance required.
   * Async - promises to return the correct data.
   *
   * @param {MongoDB Connection} connection The given connection.
   */
  static async close(connection) {
    mongoose.disconnect();
  }
}
