import request from "supertest";
import app from "../../../../app/app.js";
import tokens from "../../../testData/tokenTestData.js";
import { log } from "../../../testConfig.js";
import { executeReset, injectMockConnection, closeMockConnection } from "../../../util/util.js";
import { userResponseEthan, userResponseRaisa } from "../../../testData/userTestData.js";

const showLog = __filename
  .replace(".js", "")
  .split(/[/\\]/)
  .splice(__filename.split(/[/\\]/).lastIndexOf("__tests__") + 1)
  .reduce((acc, key) => acc && acc[key], log);
beforeEach(injectMockConnection);
beforeEach(executeReset);
afterAll(closeMockConnection);

describe("Create PhotoTags Test", () => {
  const validTag = {
    tagName: "Clouds",
    color: "#4CAF51", 
    creatingUser: "b00000000000000000000001",
    creationTime: new Date("2024-04-06"),
    modificationTime: new Date("2024-04-07"),
  };

  const expectedValidTag = {
    tagName: "Clouds",
    color: "#4CAF51",
    creatingUser: userResponseRaisa,
    creationTime: new Date("2024-04-06"),
    modificationTime: new Date("2024-04-07"),
  };

  const validTag2 = {
    tagName: "Clouds",
    color: "#FFC107",
    creatingUser: "b00000000000000000000000",
    creationTime: new Date("2024-04-06"),
    modificationTime: new Date("2024-04-07"),
  };

  const expectedValidTag2 = {
    tagName: "Clouds",
    color: "#FFC107",
    creatingUser: userResponseEthan,
    creationTime: new Date("2024-04-06"),
    modificationTime: new Date("2024-04-07"),
  };

  const validTag3 = {
    tagName: "Filler",
    color: "#4CAF51",
    creatingUser: "b00000000000000000000001",
    creationTime: new Date("2024-04-06"),
    modificationTime: new Date("2024-04-07"),
  };

  const expectedValidTag3 = {
    tagName: "Filler",
    color: "#4CAF51",
    creatingUser: userResponseRaisa,
    creationTime: new Date("2024-04-06"),
    modificationTime: new Date("2024-04-07"),
  };

  test("Tag created successfully", async () => {
    const response = await request(app)
      .post("/photo-tag/create")
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send(validTag);
    showLog && console.log(response.body);
    expect(response.statusCode).toBe(201);
    expect(response.body.tagName).toBe(expectedValidTag.tagName);
    expect(response.body.color).toBe(expectedValidTag.color);
    expect(response.body.creatingUser).toStrictEqual(expectedValidTag.creatingUser);
    expect(response.body.creationTime).toBeDefined();
    expect(response.body.modificationTime).toBeDefined();
  });

  test("Tag created successfully", async () => {
    const response = await request(app)
      .post("/photo-tag/create")
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send(validTag2);
    showLog && console.log(response.body);
    expect(response.statusCode).toBe(201);
    expect(response.body.tagName).toBe(expectedValidTag2.tagName);
    expect(response.body.color).toBe(expectedValidTag2.color);
    expect(response.body.creatingUser).toStrictEqual(expectedValidTag2.creatingUser);
    expect(response.body.creationTime).toBeDefined();
    expect(response.body.modificationTime).toBeDefined();
  });

  test("Creating a tag with existing tag name", async () => {
    const response = await request(app)
      .post("/photo-tag/create")
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send(validTag);
    const sameTagName = await request(app)
      .post("/photo-tag/create")
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send(validTag2);
    showLog && console.log(sameTagName.body);
    expect(sameTagName.statusCode).toBe(409);
    expect(sameTagName.body).toStrictEqual({ error: "Entry has duplicate key in entry.", message: "" });
  });

  test("Two tags created successfully by same user", async () => {
    const tag1 = await request(app)
      .post("/photo-tag/create")
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send(validTag);
    const tag2 = await request(app)
      .post("/photo-tag/create")
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send(validTag3);
    showLog && console.log(tag1.body) && console.log(tag2.body);
    expect(tag1.statusCode).toBe(201);
    expect(tag2.statusCode).toBe(201);
  });
});
