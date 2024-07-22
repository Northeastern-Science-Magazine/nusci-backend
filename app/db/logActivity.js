import { set } from "../util/util.js";

export default function logActivity(connection) {
  connection
    .on("open", () => process.stdout.write(set("DATABASE STATE: Connection Open").bgGreen + "\n"))
    .on("close", () => process.stdout.write(set("DATABASE STATE: Connection Closed").bgBlue + "\n"))
    .on("error", (error) => process.stdout.write(set(`DATABASE STATE: ${error}`).red + "\n"));
}
