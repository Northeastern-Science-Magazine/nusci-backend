import request from "supertest";
import app from "../../../../app/app.js";
import Connection from "../../../../app/db/connection.js";
import { log } from "../../../testConfig.js";
import { execSync } from "child_process";
import {
  validTag2,
  validTag,
  expectedValidTag,
  expectedValidTag2,
  validTag3,
  expectedValidTag3,
} from "../../../testData/photoTagTestData.js";

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
  test("Tag created successfully", async () => {
    const response = await request(app).post("/photo-tag/create").send(validTag);
    showLog && console.log(response.body);
    expect(response.statusCode).toBe(201);
    expect(response.body.tagName).toBe(expectedValidTag.tagName);
    expect(response.body.color).toBe(expectedValidTag.color);
    expect(response.body.creatingUser).toStrictEqual(expectedValidTag.creatingUser);
    expect(response.body.creationTime).toBeDefined();
    expect(response.body.modificationTime).toBeDefined();
  });

  test("Tag created successfully", async () => {
    const response = await request(app).post("/photo-tag/create").send(validTag2);
    showLog && console.log(response.body);
    expect(response.statusCode).toBe(201);
    expect(response.body.tagName).toBe(expectedValidTag2.tagName);
    expect(response.body.color).toBe(expectedValidTag2.color);
    expect(response.body.creatingUser).toStrictEqual(expectedValidTag2.creatingUser);
    expect(response.body.creationTime).toBeDefined();
    expect(response.body.modificationTime).toBeDefined();
  });

  test("Creating a tag with existing tag name", async () => {
    const response = await request(app).post("/photo-tag/create").send(validTag);
    const sameTagName = await request(app).post("/photo-tag/create").send(validTag2);
    showLog && console.log(sameTagName.body);
    expect(sameTagName.statusCode).toBe(409);
    expect(sameTagName.body).toStrictEqual({ error: "Entry has duplicate key in entry." , message: ""});
  });

  test("Two tags created successfully by same user", async () => {
    const tag1 = await request(app).post("/photo-tag/create").send(validTag);
    const tag2 = await request(app).post("/photo-tag/create").send(validTag3);
    showLog && console.log(tag1.body) && console.log(tag2.body);
    expect(tag1.statusCode).toBe(201);
    expect(tag2.statusCode).toBe(201);
  });
});
