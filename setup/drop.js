import databases_seed from "./seed/databases.js";
import SetupHelper from "./helpers.js";

import RegisteredUserSchema from "../api/models/user.registered.js";
import UnregisteredUserSchema from "../api/models/user.unregistered.js";

const allConnections = SetupHelper.openConnections(databases_seed);

process.stdout.write("Dropping all collections...\n");

RegisteredUserSchema.collection.drop();
UnregisteredUserSchema.collection.drop();

setTimeout(() => {
  process.exit();
}, 2000);
