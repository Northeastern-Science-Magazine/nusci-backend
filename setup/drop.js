import Connection from "../app/db/connection.js";
import { set } from "../app/util/util.js";
import schemaData from "./setup.js";

const silent = process.argv.includes("--silent") || process.argv.includes("-s");

silent ||
  process.stdout.write(
    set("\n-------------------------------\n[-] DROPPING ALL COLLECTIONS...\n-------------------------------\n").blue
  );

const schemas = schemaData.map((data) => data.schema);

try {
  await Connection.open(silent);
  await dropIfExists(schemas);
  await Connection.close(silent);
  process.exit();
} catch (error) {
  silent && process.stdout.write(set(`[-] Error while dropping database: ${error} \n`).red);
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
      silent || process.stdout.write(`${set(`[-] DROP ${schema.collection.name}: `).blue}${set("SUCCESSFUL\n").green}`);
    } catch (error) {
      if (error.code === 26) {
        silent ||
          process.stdout.write(`${set(`[-] DROP ${schema.collection.name}: `).blue}${set("DOES NOT EXIST\n").yellow}`);
      } else {
        silent || process.stdout.write(`${set(`[-] DROP ${schema.collection.name}: `).blue}${set("FAILED\n").red}`);
        throw new Error(error);
      }
    }
  }
}
