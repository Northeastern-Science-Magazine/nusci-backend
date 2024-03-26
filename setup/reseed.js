import RegisteredUserSchema from "../api/models/user.registered.js";
import UnregisteredUserSchema from "../api/models/user.unregistered.js";

import registered_users_seed from "./seed/registered_users_seed.js";
import unregistered_users_seed from "./seed/unregistered_users_seed.js";

import Connection from "../api/db/connection.js";

process.stdout.write("Reseeding database...\n");

// createDocuments(RegisteredUserSchema, registered_users_seed);
// createDocuments(UnregisteredUserSchema, unregistered_users_seed);

const connection = await Connection.open();

Promise.all([connection])
  .then(async () => {
    const registeredUsers = await createDocuments(RegisteredUserSchema, registered_users_seed);
    const unregisteredUsers = await createDocuments(UnregisteredUserSchema, unregistered_users_seed);
    Promise.all([registeredUsers, unregisteredUsers])
    .then(async ()=>{
      await Connection.close()
      .then(()=>{
        process.exit();
      })
    })
  });

/**
 *
 * @param {*} schema
 * @param {*} documents
 */
async function createDocuments(schema, documents) {
  for (const doc of documents) {
    await schema.create(doc);
  }
}

