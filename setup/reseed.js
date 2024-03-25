import RegisteredUserSchema from "../api/models/user.registered.js";
import UnregisteredUserSchema from "../api/models/user.unregistered.js";

import registered_users_seed from "./seed/registered_users_seed.js";
import unregistered_users_seed from "./seed/unregistered_users_seed.js";

import Connection from "../api/db/connection.js";

process.stdout.write("Reseeding database...\n");

await Connection.open();

createDocuments(RegisteredUserSchema, registered_users_seed);
createDocuments(UnregisteredUserSchema, unregistered_users_seed);

await Connection.close();

setTimeout(() => {
  process.exit();
}, 2000);

//SetupHelper.closeConnections(allConnections);

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
