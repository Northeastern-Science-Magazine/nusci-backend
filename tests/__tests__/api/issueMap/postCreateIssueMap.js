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

describe( "Create Issue Map Tests", () => {
    test("Create a valid issue map, no sections", async () => {
        const response = await request(app)
        .post("/issue-map/create")
        .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
        .send({
            issueNumber: 3,
            issueName: "newfangled rotary phones",
            pages: 3
        });
        showLog && console.log(response);
        expect(response.status).toBe(201);
        expect(response.body).toBe({issueNumber: 3, issueName: "newfangled rotary phones", pages: 3, sections: []}); // or toStrictEqual?
    });
    test("Create a valid issue map, with sections", async () => {
        const response = await request(app)
        .post("/issue-map/create")
        .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
        .send({
            issueNumber: 400,
            issueName: "morals and stars",
            pages: 8,
            sections: [
                { sectionName: "thermometers and chicken", sectionColor: "hot pink"},
                { sectionName: "iphone covers and rusty mice", sectionColor: "baby blue"}
            ]
        });
        showLog && console.log(response);
        expect(response.status).toBe(201);
        expect(response.body).toBe({ //toBe or toStrictEqual?
            issueNumber: 400,
            issueName: "morals and stars",
            pages: 8,
            sections: [
                { sectionName: "thermometers and chicken", sectionColor: "hot pink"},
                { sectionName: "iphone covers and rusty mice", sectionColor: "baby blue"}
            ]
        });
    });
    test("Attempt invalid issue map create: issue number already in use", async () => {
        const response = await request(app)
        .post("/issue-map/create")
        .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
        .send({
            issueNumber: 1, // should be occupied by the "meeting with team" issue map in issue_map_seed.js
            issueName: "newfangled rotary phones",
            pages: 3
        });
        showLog && console.log(response.body);
        expect(response.status).toBe(409);
        expect(response.body).toStrictEqual({error: "Invalid query type.", message: "Issue map with given issue number already exists."});
    });
    test("Attempt invalid issue map create: issue name already in use", async () => {
        const response = await request(app)
        .post("/issue-map/create")
        .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
        .send({
            issueNumber: 400,
            issueName: "Meeting with Team", // in issue_map_seed.js
            pages: 8,
            sections: [
                { sectionName: "thermometers and chicken", sectionColor: "hot pink"},
                { sectionName: "iphone covers and rusty mice", sectionColor: "baby blue"}
            ]
        });
        showLog && console.log(response.body);
        expect(response.status).toBe(409);
        expect(response.body).toStrictEqual({error: "Invalid query type.", message: "Issue map with given issue number already exists."})
    });

    // should I make a test for non-admin permissions? how would I go about doing that; i assume changing the cookie?
});