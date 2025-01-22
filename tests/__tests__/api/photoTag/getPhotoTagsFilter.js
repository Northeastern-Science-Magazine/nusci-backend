import request from "supertest";
import app from "../../../../app/app.js";
import tokens from "../../../testData/tokenTestData.js";
import { log } from "../../../testConfig.js";
import { executeReset, injectMockConnection, closeMockConnection } from "../../../util/util.js";
import { userResponseEthan, userResponseRaisa } from "../../../testData/userTestData.js";

const showLog = __filename
  .replace(".js", "")
  .split(/[/\\]/)
  .splice(__filename.split(/[/\\]/).lastIndexOf("__tests__") + 1)
  .reduce((acc, key) => acc && acc[key], log);
beforeEach(injectMockConnection);
beforeEach(executeReset);
afterAll(closeMockConnection);

describe("Filter PhotoTags Test", () => {

    test("no options", async () => {
        const response = await request(app).get(`/photo-tag/filter`).send({});
    
        showLog && console.log(response.body);
        expect(response.status).toBe(200);
        expect(response.body.length).toEqual(100);
      });
  });