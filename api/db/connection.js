import { config as dotenvConfig } from "dotenv";
import mongoose from "mongoose"; // import mongoose
import { log } from "mercedlogger";
import { set } from "../util.js";

//Connection to the cluster
let connection;

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
   * @returns the connection object
   */
  static async open() {
    if (!connection) {
      //Load Environment variables
      dotenvConfig();

      //Destructure env variables
      const { MONGODB_INITDB_ROOT_USERNAME, MONGODB_INITDB_ROOT_PASSWORD, MONGODB_INITDB_HOSTNAME, MONGODB_INITDB_PORT } =
        process.env;
      const DATABASE_URL = `mongodb://${MONGODB_INITDB_ROOT_USERNAME}:${MONGODB_INITDB_ROOT_PASSWORD}@${MONGODB_INITDB_HOSTNAME}:${MONGODB_INITDB_PORT}`;

      //Mongoose connect to the cluster.
      mongoose.connect(DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 50,
        socketTimeoutMS: 2500,
      });

      connection = mongoose.connection;

      //Log when open/closed
      mongoose.connection
        .on("open", () => process.stdout.write(set(set("DATABASE STATE: Connection Open").black).bgGreen + "\n"))
        .on("close", () => process.stdout.write(set(set("DATABASE STATE: Connection Closed").black).bgBlue + "\n"))
        .on("error", (error) => process.stdout.write(set(set(`DATABASE STATE: ${error}`).red + "\n")));

      return mongoose.connection;
    } else {
      return connection;
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
  static async close() {
    await connection.close();
    connection
      .on("open", () => process.stdout.write(set(set("DATABASE STATE: Connection Open").black).bgGreen + "\n"))
      .on("close", () => process.stdout.write(set(set("DATABASE STATE: Connection Closed").black).bgBlue + "\n"))
      .on("error", (error) => process.stdout.write(set(set(`DATABASE STATE: ${error}`).red + "\n")));
  }
}
