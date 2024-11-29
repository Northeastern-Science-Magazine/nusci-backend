import request from "supertest";
import app from "../../../../app/app.js";
import Connection from "../../../../app/db/connection.js";
import { log } from "../../../testConfig.js";
import { execSync } from "child_process";
import { validTag } from "../../../testData/photoTagTestData.js";

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

describe("Delete PhotoTags Test", () => {
  test("Tag deleted successfully", async () => {
    const existingTag = await request(app).post("/photo-tag/create").send(validTag);
    showLog && console.log(existingTag.body);
    expect(existingTag.statusCode).toBe(201);
    const deleteTag = await request(app).delete("/photo-tag/delete/Clouds");
    showLog && console.log(deleteTag.body);
    expect(existingTag.body).toStrictEqual(deleteTag.body);
    expect(deleteTag.statusCode).toBe(200);
    //create same tag as before and should work without problem
    const newTag = await request(app).post("/photo-tag/create").send(validTag);
    expect(newTag.statusCode).toBe(201);
  });

  test("Nonexistent tag cannot be deleted", async () => {
    const deleteNonexistentTag = await request(app).delete("/photo-tag/delete/Clouds");
    showLog && console.log(deleteNonexistentTag.body);
    expect(deleteNonexistentTag.statusCode).toBe(404);
    expect(deleteNonexistentTag.body).toStrictEqual({  error: 'Photo Tag with the specified tag name is not found.',
      message: "" });
  });
});
