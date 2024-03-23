import Connection from "../api/db/connection.js";
import databases_seed from "./seed/databases.js";
import mongoose from "mongoose";

import RegisteredUserSchema from "../api/models/user.registered.js";
import UnregisteredUserSchema from "../api/models/user.unregistered.js";

import registered_users_seed from "./seed/registered_users_seed.js";
import unregistered_users_seed from "./seed/unregistered_users_seed.js";

const allConnections = openConnections(databases_seed);

createDocuments(RegisteredUserSchema, registered_users_seed);
createDocuments(UnregisteredUserSchema, unregistered_users_seed);

setTimeout(() => {
  process.exit();
}, 2000);

//closeConnections(allConnections);

/**
 *
 * @param {*} databases
 * @returns
 */
function openConnections(databases) {
  let connections = [];
  databases.forEach((db) => {
    let connection = Connection.open(db);
    connections.push(connection);
  });
  return connections;
}

/**
 *
 * @param {*} schema
 * @param {*} documents
 */
function createDocuments(schema, documents) {
  documents.forEach((doc) => {
    schema.create(doc);
  });
}

/**
 *
 * @param {*} connections
 */
function closeConnections(connections) {
  connections.forEach((connection) => {
    Connection.close(connection);
  });
}
