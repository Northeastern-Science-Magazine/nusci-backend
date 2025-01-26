import request from "supertest";
import app from "../../../../app/app.js";
import tokens from "../../../testData/tokenTestData.js";
import { log } from "../../../testConfig.js";
import { executeReset, injectMockConnection, closeMockConnection } from "../../../util/util.js";
import IssueMapAccessor from "../../../../app/databaseAccessors/issueMapAccessor.js";

const showLog = __filename
  .replace(".js", "")
  .split(/[/\\]/)
  .splice(__filename.split(/[/\\]/).lastIndexOf("__tests__") + 1)
  .reduce((acc, key) => acc && acc[key], log);
beforeEach(injectMockConnection);
beforeEach(executeReset);
afterAll(closeMockConnection);

describe( "Create Issue Map Tests", () => {
    test("Create a valid issue map, no sections", async () => {
        const response = await request(app)
        .post("/issue-map/create")
        .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
        .send({
            issueNumber: 1,
            issueName: "newfangled rotary phones",
            pages: 3
        });
        showLog && console.log(response);
        expect(response.status).toBe(201);
        expect(response.body).toBe({issueNumber: 1, issueName: "newfangled rotary phones", pages: 3});
    });
    test("Create a valid issue map, with sections", async () => {
        const response = await request(app)
        .post("/issue-map/create")
        .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
        .send({
            issueNumber: 1,
            issueName: "morals and stars",
            pages: 8,
            sections: [
                {
                    sectionName: "thermometers and chicken",
                    sectionColor: "hot pink"
                },
                {
                    sectionName: "iphone covers and rusty mice",
                    sectionColor: "baby blue"
                }
            ]
        });
        showLog && console.log(response);
        expect(response.status).toBe(201);
    });
});