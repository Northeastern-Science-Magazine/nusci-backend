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

describe("Send Email Tests", () => {
    const testReminderEmail = {
        type: 'reminder',
        from: 'aggarwal.arus@northeastern.edu',
        to: ['rodriguezvazquez.a@northeastern.edu'],
        subject: 'this is a test',
        reminderTitle: "Run for head of photography",
        reminderDate: new Date().toLocaleDateString()
    }

    test("Send reminder email successfully", async () => {
        const response = await request(app)
      .post(`/services/email/send`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send(testReminderEmail);

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    });
})
