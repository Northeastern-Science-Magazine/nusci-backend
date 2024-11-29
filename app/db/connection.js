import { config as dotenvConfig } from "dotenv";
import mongoose from "mongoose";
import logActivity from "./logActivity.js";
import { ErrorDatabaseConnection } from "../error/errors.js";

//Connection to the cluster (cache)
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
  static async open(silentLog) {
    // log if true, undefined/null or false is false
    silentLog = silentLog ?? false;

    if (!connection) {
      //Load Environment variables
      dotenvConfig();

      //Destructure env variables
      const { MONGODB_CONNECTION_STRING } = process.env;

      try {
        //Mongoose connect to the cluster.
        mongoose.connect(MONGODB_CONNECTION_STRING, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          maxPoolSize: 50,
          socketTimeoutMS: 2500,
        });
      } catch (e) {
        throw new ErrorDatabaseConnection();
      }

      // in-memory cache of the current connection
      connection = mongoose.connection;

      //Log when open/closed
      silentLog || logActivity(mongoose.connection);

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
  static async close(silentLog) {
    silentLog = silentLog ?? false;
    if (connection) {
      await connection.close();
      silentLog || logActivity(connection);
      connection = undefined;
    }
  }
}
