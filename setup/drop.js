import MockConnection from "../tests/util/mockConnection.js";
import { set } from "../app/util/util.js";
import schemaData from "./setup.js";

const silent = process.argv.includes("--silent") || process.argv.includes("-s");

silent ||
  process.stdout.write(
    set("\n-------------------------------\n[-] DELETING ALL RECORDS FROM COLLECTIONS...\n-------------------------------\n")
      .blue
  );

const schemas = schemaData.map((data) => data.schema);

try {
  await MockConnection.open(silent);
  await dropIfExists(schemas);
  await MockConnection.close(silent);
  process.exit();
} catch (error) {
  silent && process.stdout.write(set(`[-] Error while deleting records: ${error} \n`).red);
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
      await schema.collection.deleteMany({});
      silent ||
        process.stdout.write(
          `${set(`[-] DELETING RECORDS FROM ${schema.collection.name}: `).blue}${set("SUCCESSFUL\n").green}`
        );
    } catch (error) {
      if (error.code === 26) {
        silent ||
          process.stdout.write(
            `${set(`[-] DELETE RECORDS ${schema.collection.name}: `).blue}${set("DOES NOT EXIST\n").yellow}`
          );
      } else {
        silent ||
          process.stdout.write(`${set(`[-] DELETE RECORDS ${schema.collection.name}: `).blue}${set("FAILED\n").red}`);
        throw new Error(error);
      }
    }
  }
}
