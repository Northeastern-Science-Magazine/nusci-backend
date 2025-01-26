import schemaData from "./setup.js";
import MockConnection from "../tests/util/mockConnection.js";
import { set } from "../app/util/util.js";

const silent = process.argv.includes("--silent") || process.argv.includes("-s");

silent ||
  process.stdout.write(
    set("\n--------------------------------\n[+] RESEEDING ALL COLLECTIONS...\n--------------------------------\n").blue
  );

try {
  await MockConnection.open(silent);
  await reseed(schemaData);
  await MockConnection.close(silent);
  process.exit();
} catch (error) {
  silent || process.stdout.write(set(`Error while reseeding database: ${error}\n`).red);
  process.exit(1);
}

/**
 *
 * @param {JSON} setupData
 */
async function reseed(setupData) {
  for (const data of setupData) {
    await createDocuments(data.schema, data.seed);
  }
}

/**
 *
 * @param {MongooseSchema} schema
 * @param {JSON} documents
 */
async function createDocuments(schema, documents) {
  for (const doc of documents) {
    await schema.create(doc);
  }
  silent || process.stdout.write(`${set(`[+] RESEED ${schema.collection.name}: `).blue}${set("SUCCESSFUL\n").green}`);
}
