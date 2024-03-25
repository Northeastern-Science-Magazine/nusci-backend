import RegisteredUserSchema from "../api/models/user.registered.js";
import UnregisteredUserSchema from "../api/models/user.unregistered.js";

import Connection from "../api/db/connection.js";

process.stdout.write("Dropping all collections...\n");

const connection = await Connection.open();

Promise.all([connection])
  .then(async () => {
    await RegisteredUserSchema.collection.drop();
    await UnregisteredUserSchema.collection.drop();
  })
  .then(async () => {
    await Connection.close();
  })
  .then(() => {
    process.exit();
  });
