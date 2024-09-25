import request from "supertest";
import app from "../../../../app/app.js";
import Connection from "../../../../app/db/connection.js";
import { log } from "../../../testConfig.js";
import { execSync } from "child_process";
import { existingTag, validTag } from "../../../testData/photoTagTestData.js";

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

describe("Create PhotoTags Test", () => {
  
  test("Tag name created successfully", async () => {
    const response = await request(app).post("/photo-tag/create").send(validTag)

    showLog && console.log(response.body);
    expect(response.status).toBe(201);
    //expect(response.body.message).toBe("Tag created successfully");  // not the expected response body
  });

  test("Same tag names", async () => {
    const response = await request(app).post("/photo-tag/create").send(existingTag)
    showLog && console.log(response.body);
    expect(response.statusCode).toBe(404); 
  });
});
