import RegisteredUserSchema from "../api/models/user.registered.js";
import UnregisteredUserSchema from "../api/models/user.unregistered.js";

import Connection from "../api/db/connection.js";

process.stdout.write("Dropping all collections...\n");

try {
  await Connection.open();
  await Promise.all([
    RegisteredUserSchema.collection.drop(),
    UnregisteredUserSchema.collection.drop()
  ]);
  await Connection.close();
  process.exit();
} catch (error) {
  process.stdout.write("Error while dropping database: " + error + "\n");
  process.exit(1);
}