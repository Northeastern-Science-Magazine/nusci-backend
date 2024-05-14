import Connection from "../api/db/connection.js";
import { set } from "../api/util.js";
import schemaData from "./setup.js";

process.stdout.write(set("[-] DROPPING ALL COLLECTIONS...\n-------------------------------\n").blue);

const schemas = schemaData.map((data) => data.schema);

try {
  await Connection.open();
  await dropIfExists(schemas);
  await Connection.close();
  process.exit();
} catch (error) {
  process.stdout.write(set(`[-] Error while dropping database: ${error} \n`).red);
  process.exit(1);
}

/**
 *
 *
 * @param {List[MongooseSchema]} schemas
 */
async function dropIfExists(schemas) {
  for (const schema of schemas) {
    try {
      await schema.collection.drop();
      process.stdout.write(`${set(`[-] DROP ${schema.collection.name}: `).blue}${set("SUCCESSFUL\n").green}`);
    } catch (error) {
      if (error.code === 26) {
        process.stdout.write(`${set(`[-] DROP ${schema.collection.name}: `).blue}${set("DOES NOT EXIST\n").yellow}`);
      } else {
        process.stdout.write(`${set(`[-] DROP ${schema.collection.name}: `).blue}${set("FAILED\n").red}`);
        throw new Error(error);
      }
    }
  }
}
