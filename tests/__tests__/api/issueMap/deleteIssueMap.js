import request from "supertest";
import app from "../../../../app/app.js";
import tokens from "../../../testData/tokenTestData.js";
import { log } from "../../../testConfig.js";
import { executeReset, injectMockConnection, closeMockConnection } from "../../../util/util.js";

const showLog = __filename
  .replace(".js", "")
  .split(/[/\\]/)
  .splice(__filename.split(/[/\\]/).lastIndexOf("__tests__") + 1)
  .reduce((acc, key) => acc && acc[key], log);
beforeEach(injectMockConnection);
beforeEach(executeReset);
afterAll(closeMockConnection);

describe("Delete issue map", () => {
  /* In-file testing data */
  const adminToken = tokens["ethan@ethan.com"];
  const editorToken = tokens["noah@noah.com"];

  const deleteIssue = (issueNumber, token = adminToken) =>
    request(app)
      .delete(`/issue-map/${issueNumber}`)
      .set("Cookie", [`token=${token}`]);

  test("Admin deletes an empty issue", async () => {
    await request(app)
      .post("/issue-map/create")
      .set("Cookie", [`token=${adminToken}`])
      .send({ issueNumber: 3, issueName: "Spring 2027", pages: 40 });

    const response = await deleteIssue(3);
    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.issueNumber).toBe(3);

    const list = await request(app)
      .get("/issue-map/all")
      .set("Cookie", [`token=${adminToken}`]);
    expect(list.body.map((issue) => issue.issueNumber)).toStrictEqual([2, 1]);
  });

  test("Issue that still contains articles cannot be deleted", async () => {
    const response = await deleteIssue(1);
    showLog && console.log(response.body);
    expect(response.status).toBe(409);
    expect(response.body.message).toBe("Issue #1 still contains 3 articles. Remove them before deleting the issue.");
  });

  test("Deleting a missing issue returns not found", async () => {
    const response = await deleteIssue(999);
    showLog && console.log(response.body);
    expect(response.status).toBe(404);
  });

  test("Invalid issue number is rejected", async () => {
    const response = await deleteIssue("abc");
    showLog && console.log(response.body);
    expect(response.status).toBe(400);
  });

  test("Non-admin cannot delete an issue", async () => {
    const response = await deleteIssue(1, editorToken);
    showLog && console.log(response.body);
    expect(response.status).toBe(403);
  });
});
