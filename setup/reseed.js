import schemaData from "./setup.js";
import Connection from "../api/db/connection.js";
import { set } from "../api/util.js";

process.stdout.write(
  set("\n--------------------------------\n[+] RESEEDING ALL COLLECTIONS...\n--------------------------------\n").blue
);

try {
  await Connection.open();
  await reseed(schemaData);
  await Connection.close();
  process.exit();
} catch (error) {
  process.stdout.write(set(`Error while reseeding database: ${error}\n`).red);
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
  process.stdout.write(`${set(`[+] RESEED ${schema.collection.name}: `).blue}${set("SUCCESSFUL\n").green}`);
}
