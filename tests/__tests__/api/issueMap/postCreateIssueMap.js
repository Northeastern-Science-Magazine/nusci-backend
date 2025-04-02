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
            pages: 7
        });
        console.log(response.body);
        expect(response.status).toBe(201);
        expect(response.body.issueNumber).toBe(3);
        expect(response.body.issueName).toBe("newfangled rotary phones");
        expect(response.body.pages).toBe(7);
        expect(response.body.sections).toStrictEqual([]);
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
                { sectionName: "thermometers and chicken", color: "hot pink"},
                { sectionName: "iphone covers and rusty mice", color: "baby blue"}
            ]
        });
        console.log(response.body);
        expect(response.status).toBe(201);
        expect(response.body.issueNumber).toBe(400);
        expect(response.body.issueName).toBe("morals and stars");
        expect(response.body.pages).toBe(8);
        expect(response.body).toHaveProperty("sections");
        expect(response.body.sections).toHaveLength(2);
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
        //expect(response.body).toStrictEqual({error: "Issue map with provided credentials already exists.", message: ""});
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
                { sectionName: "thermometers and chicken", color: "hot pink"},
                { sectionName: "iphone covers and rusty mice", color: "baby blue"}
            ]
        });
        showLog && console.log(response.body);
        expect(response.status).toBe(409);
        //expect(response.body).toStrictEqual({error: "Issue map with provided credentials already exists.", message: ""})
    });
    test("Attempt invalid issue map create: wrong user permissions", async () => {
        const response = await request(app)
        .post("/issue-map/create")
        .set("Cookie", [`token=${tokens["arushi@arushi.com"]}`])
        .send({
            issueNumber: 20,
            issueName: "donut seam like a snow day?",
            pages: 70,
            sections: [
                { sectionName: "bright futures", color: "insert hex code here"}
            ]
        });
        console.log(response.body);
        expect(response.status).toBe(403);
        expect(response.body).toStrictEqual({error: "Insufficient permissions to access this resource.", message: ""})
    });
});