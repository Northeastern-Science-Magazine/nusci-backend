import { config as dotenvConfig } from 'dotenv';
import mongoose from 'mongoose'; // import mongoose
import { log } from 'mercedlogger';

export default class Database {

    //Establishes the connection to the database given a collection
    static async connectTo(db) {
        dotenvConfig(); // load .env variables

        // DESTRUCTURE ENV VARIABLES
        const { MONGO_USERNAME, MONGO_PASSWORD, MONGO_CLUSTER } = process.env;
        const DATABASE_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_CLUSTER}.xtdufxk.mongodb.net/?retryWrites=true&w=majority`;

        // CONNECT TO MONGO
        mongoose.connect = mongoose.connect(
            DATABASE_URL,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                maxPoolSize: 50,
                socketTimeoutMS: 2500,
                dbName: db
            });

        // CONNECTION EVENTS
        mongoose.connection
        .on("open", () => log.green("DATABASE STATE", "Connection Open"))
        .on("close", () => log.magenta("DATABASE STATE", "Connection Closed"))
        .on("error", (error) => log.red("DATABASE STATE", error))

        return mongoose.connection;
    }

    //closes the given database connection
    static async close(connection) {
        connection.close();
    }
}