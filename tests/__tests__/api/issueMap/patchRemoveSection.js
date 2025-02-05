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

describe("Remove section from issue map", () => {
  const validSection = {
    issueNumber: 1,
    sections: [
      {
        articles: [],
      },
    ],
    articles: ["a00000000000000000000000", "a00000000000000000000002", "a00000000000000000000001"],
  };

  const emptySection = {
    issueNumber: 1,
    sections: [
      {
        articles: [],
      },
    ],
    articles: ["a00000000000000000000003", "a00000000000000000000005"],
  };

  test("Remove valid section with no articles in section", async () => {
    const requestBody = {
      issueNumber: 2,
      sectionName: "Event Planning",
      sectionColor: "#33FF66",
    };

    const response = await request(app)
      .patch(`/issue-map/remove-section`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send(requestBody);

    showLog && console.log(response);
    expect(response.status).toBe(200);
    expect(response.body.sections).not.toContainEqual(
      expect.objectContaining({
        sectionName: requestBody.sectionName,
        color: requestBody.sectionColor,
      })
    );

    expect(response.body.articles).toStrictEqual(emptySection.articles);
  });

  test("Remove valid section with multiple articles in section", async () => {
    const requestBody = {
      issueNumber: 1,
      sectionName: "Project Discussion",
      sectionColor: "#FF5733",
    };

    const response = await request(app)
      .patch(`/issue-map/remove-section`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send(requestBody);

    showLog && console.log(response);
    expect(response.status).toBe(200);
    expect(response.body.sections).not.toContainEqual(
      expect.objectContaining({
        sectionName: requestBody.sectionName,
        color: requestBody.sectionColor,
      })
    );

    expect(response.body.articles).toStrictEqual(validSection.articles);
  });

  test("Remove invalid section with no corresponding issue number", async () => {
    const requestBody = {
      issueNumber: 3,
      sectionName: "Project Discussion",
      sectionColor: "#FF5733",
    };

    const response = await request(app)
      .patch(`/issue-map/remove-section`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send(requestBody);

    showLog && console.log(response);
    expect(response.status).toBe(404);
    const errorMessage = JSON.parse(response.text).error;
    expect(errorMessage).toStrictEqual("Issue Map not found.");
  });

  test("Remove invalid section from issue map where the sectionName and color exists in another issue", async () => {
    const requestBody = {
      issueNumber: 2,
      sectionName: "Project Discussion",
      sectionColor: "#FF5733",
    };

    const response = await request(app)
      .patch(`/issue-map/remove-section`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send(requestBody);

    showLog && console.log(response);
    expect(response.status).toBe(404);
    const errorMessage = JSON.parse(response.text).error;
    expect(errorMessage).toStrictEqual("Issue Map not found.");
  });
});
