import { execSync } from "child_process";
import request from "supertest";
import app from "../../../../app/app.js";
import Connection from "../../../../app/db/connection.js";
import { log } from "../../../testConfig.js";
import tokens from "../../../testData/tokenTestData.js";

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


describe("Tests for article cascade deletion", () => {
    test("trivial test", async () => {
        const response = await request(app).delete("/articles/delete/mark-s-w-sweess-reflects-on-success-creativity-making-mistakes-and-his-time-at-northeastern")
        .set("Cookie", [`token=${tokens.ethan}`]);
        expect(response.status).toBe(204);
    })
})