import { config as dotenvConfig } from "dotenv";
import mongoose from "mongoose";
import { ErrorDatabaseConnection } from "../../app/error/errors.js";

/**
 * This file is a test version of the connection file in the
 * backend application.
 *
 * NOTE: This class still makes a legitimate connection
 * to your local database instance, despite its name.
 *
 * In order to run tests, we need to leverage the test
 * connection string, rather than the actual connection string.
 * The only difference between this file and the `connection.js`
 * file is the environment variable used to connect to the db.
 * This file also does not emit terminal logs.
 *
 * This class should not be imported anywhere except the
 * `setJestConnection.js` file.
 */

let connection;

export default class MockConnection {
  static async open() {
    if (!connection) {
      dotenvConfig();
      const { MONGODB_TEST_CONNECTION_STRING } = process.env;
      try {
        mongoose.connect(MONGODB_TEST_CONNECTION_STRING, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          maxPoolSize: 50,
          socketTimeoutMS: 2500,
        });
      } catch (e) {
        throw new ErrorDatabaseConnection();
      }
      connection = mongoose.connection;
      return mongoose.connection;
    } else {
      return connection;
    }
  }

  static async close() {
    if (connection) {
      await connection.close();
      connection = undefined;
    }
  }
}
