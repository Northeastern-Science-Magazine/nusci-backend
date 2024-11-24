import schemaData from "./setup.js";
import Connection from "../app/db/connection.js";

const silent = process.argv.includes("--silent") || process.argv.includes("-s");

let log = new Set();

await Connection.open(silent);
for (const { schema } of schemaData) {
    schema.pre(/\.*/, function () {
        try {
            log.add(this.constructor.db.databaseName);
            next();
        } catch (error) {
            console.log(error);
        }
    });
}
await Connection.close(silent);

let changed = [];
for (const entries in log.entries) {
    console.log("d");
    switch (entries) {
        case 'Article':
            changed.push(schemaData[0]["model"]);
            break;
        case 'IssueMap':
            changed.push(schemaData[1]);
            break;
        case 'PhotoTag':
            changed.push(schemaData[2]);
            break;
        case 'User':
            changed.push(schemaData[3]);
            break;
    }
}

export default changed;