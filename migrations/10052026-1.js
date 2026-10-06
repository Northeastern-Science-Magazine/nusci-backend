import Connection from "../app/db/connection.js";
import IssueMap from "../app/models/dbModels/issueMap.js";

/**
 * Rebuilds the issue_maps indexes to match the IssueMap schema.
 *
 * Drops the old unique indexes on `articles` and `sections.sectionName`,
 * which made it impossible to have more than one issue with no articles
 * (or no sections), and replaces `articles` with a partial unique index.
 */
async function migrate() {
  await Connection.open();
  const dropped = await IssueMap.syncIndexes();
  console.log("Dropped indexes: ", dropped);
  console.log(
    "Current indexes: ",
    (await IssueMap.listIndexes()).map((index) => index.name)
  );
  await Connection.close();
}

await migrate();
process.exit();
