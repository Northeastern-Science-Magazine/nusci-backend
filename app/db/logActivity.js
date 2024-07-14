import { set } from "../util/util.js";

export default function logActivity(connection) {
  connection
    .on("open", () => console.log("wepojf"))
    .on("close", () => console.log("yeet"))
    .on("error", (error) => console.log("oiwehtf"));
}
