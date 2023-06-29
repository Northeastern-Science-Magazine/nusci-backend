import { config as dotenvConfig } from 'dotenv';

dotenvConfig(); // load .env variables

import mongoose from 'mongoose' // import mongoose
import { log } from 'mercedlogger';

//DESTRUCTURE ENV VARIABLES
const {DATABASE_URL} = process.env 

// CONNECT TO MONGO
mongoose.connect = mongoose.connect(DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true})

// CONNECTION EVENTS
mongoose.connection
.on("open", () => log.green("DATABASE STATE", "Connection Open"))
.on("close", () => log.magenta("DATABASE STATE", "Connection Open"))
.on("error", (error) => log.red("DATABASE STATE", error))

const Schema = mongoose.Schema;
const model = mongoose.model;
// EXPORT CONNECTION
export { Schema, model };