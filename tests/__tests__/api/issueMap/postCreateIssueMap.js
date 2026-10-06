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

describe("Create issue map", () => {
  /* In-file testing data */
  const adminToken = tokens["ethan@ethan.com"];
  const editorToken = tokens["noah@noah.com"];
  const validIssue = { issueNumber: 3, issueName: "Spring 2027", pages: 40 };

  const createIssue = (body, token = adminToken) =>
    request(app)
      .post("/issue-map/create")
      .set("Cookie", [`token=${token}`])
      .send(body);

  test("Admin creates an issue successfully", async () => {
    const response = await createIssue(validIssue);
    showLog && console.log(response.body);
    expect(response.status).toBe(201);
    expect(response.body.issueNumber).toBe(3);
    expect(response.body.issueName).toBe("Spring 2027");
    expect(response.body.pages).toBe(40);
    expect(response.body.creationTime).toBeDefined();
  });

  test("Admin creates an issue with multiple sections", async () => {
    const response = await createIssue({
      ...validIssue,
      sections: [
        { sectionName: "Features", sectionColor: "#FF5733" },
        { sectionName: "Opinion", sectionColor: "#3366FF" },
      ],
    });
    showLog && console.log(response.body);
    expect(response.status).toBe(201);
    expect(response.body.sections.map(({ sectionName, color }) => ({ sectionName, color }))).toStrictEqual([
      { sectionName: "Features", color: "#FF5733" },
      { sectionName: "Opinion", color: "#3366FF" },
    ]);
    response.body.sections.forEach((section) => {
      expect(section.creatingUser).toBe("b00000000000000000000000");
      expect(section.articles).toStrictEqual([]);
      expect(section.creationTime).toBeDefined();
    });
  });

  test("Different issues can reuse the same section name", async () => {
    const sections = [{ sectionName: "Event Planning", sectionColor: "#33FF66" }];
    const response = await createIssue({ ...validIssue, sections });
    showLog && console.log(response.body);
    expect(response.status).toBe(201);
  });

  test("Multiple empty issues can be created", async () => {
    const first = await createIssue(validIssue);
    const second = await createIssue({ issueNumber: 4, issueName: "Fall 2027", pages: 0 });
    showLog && console.log(second.body);
    expect(first.status).toBe(201);
    expect(second.status).toBe(201);
  });

  test("Created issue appears in the issue list", async () => {
    await createIssue(validIssue);
    const response = await request(app)
      .get("/issue-map/all")
      .set("Cookie", [`token=${adminToken}`]);
    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.map((issue) => issue.issueNumber)).toStrictEqual([3, 2, 1]);
  });

  test("Duplicate issue number is rejected", async () => {
    const response = await createIssue({ issueNumber: 1, issueName: "Something New", pages: 10 });
    showLog && console.log(response.body);
    expect(response.status).toBe(409);
    expect(response.body.message).toBe("Issue #1 already exists.");
    const list = await request(app)
      .get("/issue-map/all")
      .set("Cookie", [`token=${adminToken}`]);
    expect(list.body.map((issue) => issue.issueName)).not.toContain("Something New");
  });

  test("Duplicate issue name is rejected", async () => {
    const response = await createIssue({ issueNumber: 10, issueName: "Club Holiday Party", pages: 10 });
    showLog && console.log(response.body);
    expect(response.status).toBe(409);
    expect(response.body.message).toBe('An issue named "Club Holiday Party" already exists.');
    const list = await request(app)
      .get("/issue-map/all")
      .set("Cookie", [`token=${adminToken}`]);
    expect(list.body.map((issue) => issue.issueNumber)).not.toContain(10);
  });

  test.each([
    { issueNumber: 0, issueName: "Zero", pages: 10 },
    { issueNumber: 2.5, issueName: "Fraction", pages: 10 },
    { issueNumber: 5, issueName: "   ", pages: 10 },
    { issueNumber: 5, issueName: "Negative Pages", pages: -1 },
    { issueName: "Missing Number", pages: 10 },
    { ...validIssue, sections: [{ sectionName: "Features" }] },
    { ...validIssue, sections: [{ sectionName: " ", sectionColor: "#FFFFFF" }] },
    {
      ...validIssue,
      sections: [
        { sectionName: "Features", sectionColor: "#FF5733" },
        { sectionName: "Features", sectionColor: "#3366FF" },
      ],
    },
  ])("Invalid body is rejected: %o", async (body) => {
    const response = await createIssue(body);
    showLog && console.log(response.body);
    expect(response.status).toBe(400);
  });

  test("Non-admin cannot create an issue", async () => {
    const response = await createIssue(validIssue, editorToken);
    showLog && console.log(response.body);
    expect(response.status).toBe(403);
  });

  test("Logged out user cannot create an issue", async () => {
    const response = await request(app).post("/issue-map/create").send(validIssue);
    showLog && console.log(response.body);
    expect(response.status).toBe(403);
  });
});
