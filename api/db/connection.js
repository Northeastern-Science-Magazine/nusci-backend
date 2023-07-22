import { config as dotenvConfig } from 'dotenv';

dotenvConfig(); // load .env variables

import mongoose from 'mongoose' // import mongoose
import { log } from 'mercedlogger';

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
        socketTimeoutMS: 2500
    })

// CONNECTION EVENTS
mongoose.connection
.on("open", () => log.green("DATABASE STATE", "Connection Open"))
.on("close", () => log.magenta("DATABASE STATE", "Connection Open"))
.on("error", (error) => log.red("DATABASE STATE", error))

const Schema = mongoose.Schema;
const model = mongoose.model;

// EXPORT CONNECTION
export { Schema, model };