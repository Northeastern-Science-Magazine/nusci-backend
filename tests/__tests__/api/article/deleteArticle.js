import { execSync } from "child_process";
import request from "supertest";
import app from "../../../../app/app.js";
import Connection from "../../../../app/db/connection.js";
import { log } from "../../../testConfig.js";
import tokens from "../../../testData/tokenTestData.js";
import Article from "../../../../app/models/dbModels/article.js";
import IssueMapSchema from "../../../../app/models/dbModels/issueMap.js";
import articles_seed from "../../../../setup/seed/articles_seed.js";
import issue_map_seed from "../../../../setup/seed/issue_map_seed.js";
import IssueMap from "../../../../app/models/dbModels/issueMap.js";

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


describe("Tests for article cascade deletion", () => {
    test("trivial test", async () => {

        const slugOne = "/articles/delete/mark-s-w-sweess-reflects-on-success-creativity-making-mistakes-and-his-time-at-northeastern";
        const slugTwo = "/articles/delete/exploring-the-future-ai-integration-in-everyday-life";
        const slugThree = "/articles/delete/invalid-slug";

        const issueOne = issue_map_seed[0];
        console.log(issueOne._id);
        let issueMap = await IssueMap.findById(issueOne._id);
        console.log(issueMap.articles);

        const response = await request(app).delete(slugOne)
        .set("Cookie", [`token=${tokens.ethan}`]);

        issueMap = await IssueMap.findById(issueOne._id);
     
        expect(issueMap.articles.length).toBe(2);
        expect(issueMap.articles).not.toContain("a00000000000000000000001");

        const response_two = await request(app).delete(slugTwo)
        .set("Cookie", [`token=${tokens.ethan}`]);

        issueMap = await IssueMap.findById(issueOne._id);
       
        expect(issueMap.articles.length).toBe(1);
        expect(issueMap.articles).not.toContain("a00000000000000000000000");

        const invalid = await request(app).delete(slugThree)
        .set("Cookie", [`token=${tokens.ethan}`]);

        showLog && console.log(response.body);

        expect(response.status).toBe(204);
        expect(response.body).toEqual({});
      
        expect(response_two.status).toBe(204);
        expect(response_two.body).toEqual({});

        expect(invalid.status).toBe(404);

    })
   
  });




