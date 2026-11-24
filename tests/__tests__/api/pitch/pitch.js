import request from "supertest";
import app from "../../../../app/app.js";
import tokens from "../../../testData/tokenTestData.js";
import { log } from "../../../testConfig.js";
import User from "../../../../app/models/dbModels/user.js";
import PitchSettings from "../../../../app/models/dbModels/pitchSettings.js";
import PitchAccessor from "../../../../app/databaseAccessors/pitchAccessor.js";
import EmailAccessor from "../../../../app/databaseAccessors/emailAccessor.js";
import { ResendEmail } from "../../../../app/services/email/emailService.js";
import MockConnection from "../../../util/mockConnection.js";
import { executeReset, injectMockConnection, closeMockConnection } from "../../../util/util.js";

const showLog = __filename
  .replace(".js", "")
  .split(/[/\\]/)
  .splice(__filename.split(/[/\\]/).lastIndexOf("__tests__") + 1)
  .reduce((acc, key) => acc && acc[key], log);

const adminCookie = [`token=${tokens["ethan@ethan.com"]}`];
const editorCookie = [`token=${tokens["noah@noah.com"]}`];

const validPitch = {
  name: "Test Student",
  email: "student@northeastern.edu",
  topic: "An article about tardigrades.",
  draftUrl: "",
};

/**
 * Makes kayla@kayla.com (an admin) an eligible recipient regardless of the current year,
 * and returns her id.
 */
const makeEligibleAdmin = async () => {
  await MockConnection.open();
  await User.updateOne({ email: "kayla@kayla.com" }, { graduationYear: new Date().getFullYear() + 1 });
  const user = await User.findOne({ email: "kayla@kayla.com" }).lean();
  return user._id.toString();
};

beforeEach(injectMockConnection);
beforeEach(executeReset);
// The reset script doesn't touch pitch settings, so clear them between tests.
beforeEach(async () => {
  await MockConnection.open();
  await PitchSettings.deleteMany({});
});
beforeEach(() => jest.spyOn(ResendEmail, "sendEmailWithTemplate").mockResolvedValue({ id: "test" }));
afterEach(() => jest.restoreAllMocks());
afterAll(closeMockConnection);

describe("Pitch settings", () => {
  test("admin gets settings with no recipients configured", async () => {
    const id = await makeEligibleAdmin();
    const response = await request(app).get("/pitch/settings").set("Cookie", adminCookie);

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.recipientIds).toEqual([]);
    expect(response.body.eligibleRecipients.map((u) => u._id)).toContain(id);
  });

  test("non-admin cannot get settings", async () => {
    const response = await request(app).get("/pitch/settings").set("Cookie", editorCookie);
    expect(response.status).toBe(403);
  });

  test("admin updates recipients (deduped, lowercased)", async () => {
    const id = await makeEligibleAdmin();
    const response = await request(app)
      .patch("/pitch/settings")
      .set("Cookie", adminCookie)
      .send({ recipientIds: [id, id.toUpperCase()] });

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ recipientIds: [id] });

    const settings = await request(app).get("/pitch/settings").set("Cookie", adminCookie);
    expect(settings.body.recipientIds).toEqual([id]);
  });

  test("invalid recipient id format is rejected", async () => {
    const response = await request(app)
      .patch("/pitch/settings")
      .set("Cookie", adminCookie)
      .send({ recipientIds: ["not-an-id"] });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid user ID.");
  });

  test("ineligible recipient is rejected", async () => {
    const response = await request(app)
      .patch("/pitch/settings")
      .set("Cookie", adminCookie)
      .send({ recipientIds: ["000000000000000000000000"] });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Recipients must be admins graduating this year or later.");
  });

  test("unexpected errors return 500", async () => {
    jest.spyOn(PitchAccessor, "getEligibleRecipients").mockRejectedValue(new Error("db down"));

    const get = await request(app).get("/pitch/settings").set("Cookie", adminCookie);
    expect(get.status).toBe(500);

    const patch = await request(app)
      .patch("/pitch/settings")
      .set("Cookie", adminCookie)
      .send({ recipientIds: ["000000000000000000000000"] });
    expect(patch.status).toBe(500);
  });
});

describe("Submit pitch", () => {
  const configureRecipient = async () => {
    const id = await makeEligibleAdmin();
    await PitchAccessor.updateSettings([id]);
  };

  test("valid pitch is emailed to the configured recipients", async () => {
    await configureRecipient();
    const createEmail = jest.spyOn(EmailAccessor, "createEmail");

    const response = await request(app).post("/pitch").send(validPitch);

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Thank you for your pitch! We will reach out via email.");
    expect(ResendEmail.sendEmailWithTemplate).toHaveBeenCalledWith(
      expect.objectContaining({
        to: ["kayla@kayla.com"],
        variables: expect.objectContaining({ draftUrl: "No draft provided." }),
      })
    );
    expect(createEmail).toHaveBeenCalled();
  });

  test("a failure to log the email still returns 200", async () => {
    await configureRecipient();
    jest.spyOn(EmailAccessor, "createEmail").mockRejectedValue(new Error("log failed"));
    jest.spyOn(console, "error").mockImplementation(() => {});

    const response = await request(app).post("/pitch").send(validPitch);
    expect(response.status).toBe(200);
  });

  test("non-Northeastern email is rejected", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    const response = await request(app)
      .post("/pitch")
      .send({ ...validPitch, email: "someone@gmail.com" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Please use your Northeastern email.");
  });

  test("no configured recipients returns 500", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    const response = await request(app).post("/pitch").send(validPitch);

    expect(response.status).toBe(500);
    expect(ResendEmail.sendEmailWithTemplate).not.toHaveBeenCalled();
  });

  test("configured recipients who are no longer eligible returns 500", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    await MockConnection.open();
    await PitchAccessor.updateSettings(["000000000000000000000000"]);

    const response = await request(app).post("/pitch").send(validPitch);
    expect(response.status).toBe(500);
    expect(ResendEmail.sendEmailWithTemplate).not.toHaveBeenCalled();
  });

  test("email send failure returns 500", async () => {
    await configureRecipient();
    jest.spyOn(console, "error").mockImplementation(() => {});
    ResendEmail.sendEmailWithTemplate.mockRejectedValue(new Error("resend down"));

    const response = await request(app).post("/pitch").send(validPitch);
    expect(response.status).toBe(500);
  });
});
