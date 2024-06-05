import { set } from "../util.js";

export default function logActivity(connection) {
  connection
    .on("open", () => process.stdout.write(set(set("DATABASE STATE: Connection Open").black).bgGreen + "\n"))
    .on("close", () => process.stdout.write(set(set("DATABASE STATE: Connection Closed").black).bgBlue + "\n"))
    .on("error", (error) => process.stdout.write(set(set(`DATABASE STATE: ${error}`).red + "\n")));
}
