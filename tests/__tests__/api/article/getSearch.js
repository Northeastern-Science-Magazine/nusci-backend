import { execSync } from "child_process";
import request from "supertest";
import app from "../../../../app/app.js";
import {
  validArticleSlug,
  validAuthorsUpdate,
  invalidAuthorsUpdate,
  emptyAuthorsUpdate,
} from "../../../testData/articleTestData.js";
import Connection from "../../../../app/db/connection.js";
import tokens from "../../../testData/tokenTestData.js";
import { log } from "../../../testConfig.js";

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

describe("Get Article Search", () => {
    test("", async () => {
      const response = await request(app)
        .get(`/articles/search/issueNumber=3&authors=jasmine@jasmine.com`)
        .set("Cookie", [`token=${tokens.ethan}`]);
  
      showLog && console.log(response.body);
      expect(response.status).toBe(200);
      //expect({ authors: response.body.authors.map((author) => author.username) }).toEqual(validAuthorsUpdate);
    });
});  