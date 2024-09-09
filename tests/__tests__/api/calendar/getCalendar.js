import { execSync } from "child_process";
import request from "supertest";
import app from "../../../../app/app.js";
import Connection from "../../../../app/db/connection.js";
import { log } from "../../../testConfig.js";
import Test from "supertest/lib/test.js";

const showLog = __filename
    .replace(".js", "")
    .split(/[/\\]/)
    .splice(__filename.split(/[/\\]/).lastIndexOf("__tests__") + 1)
    .reduce((acc, key) => acc && acc[key], log);

beforeAll(async () => {
    await Connection.open(true);
});

afterAll(async () => {
    await Connection.close(true);
});

beforeEach(async () => {
    execSync("npm run reset-s", { stdio: "ignore" });
});

describe("Get Calendar Event", () => {
    test("gets all calendar events successfully", async () => {
        const response = await request(app)
            .get("/calendar")
            

        showLog && console.log(response.body);
        expect(response.status).toBe(200);
    })
})