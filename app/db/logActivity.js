import { set } from "../util/util.js";

export default function logActivity(connection) {
  connection
    .on("open", () => process.stdout.write("DATABASE STATE: Connection Open"+ "\n"))
    .on("close", () => process.stdout.write("DATABASE STATE: Connection Closed" + "\n"))
    .on("error", (error) => process.stdout.write(`DATABASE STATE: ${error}`+ "\n"));
}
