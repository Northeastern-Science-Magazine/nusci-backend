import request from "supertest";
import app from "../../../../app/app.js";
import tokens from "../../../testData/tokenTestData.js";
import { log } from "../../../testConfig.js";
import { executeReset, injectMockConnection, closeMockConnection } from "../../../util/util.js";
import { userResponseEthan, userResponseRaisa } from "../../../testData/userTestData.js";
import WritingStatus from "../../../../app/models/enums/writingStatus.js";
import PhotographyStatus from "../../../../app/models/enums/photographyStatus.js";
import ArticleStatus from "../../../../app/models/enums/articleStatus.js";
import DesignStatus from "../../../../app/models/enums/designStatus.js";
jest.setTimeout(10000);
const showLog = __filename
  .replace(".js", "")
  .split(/[/\\]/)
  .splice(__filename.split(/[/\\]/).lastIndexOf("__tests__") + 1)
  .reduce((acc, key) => acc && acc[key], log);

beforeEach(injectMockConnection);
beforeEach(executeReset);
afterAll(closeMockConnection);

describe("Create Article Test", () => {

    const validArticle = {
        title: "Article1", 
        slug: "article-1",
        categories: ["technology"],
        pageLength: 1, 
        articleStatus: "pending", 
        writingStatus: "has_editor", 
        photographyStatus: "no_photo",
        designStatus: "completed",
    };

    test ("Create Valid article", async () => {
    const response = await request(app)
    .post("/articles/create")
    //.set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
    .send(validArticle);
     showLog && console.log(response.body);
     expect(response.status).toBe(400);
    });
});