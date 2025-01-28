import request from "supertest";
import app from "../../../../app/app.js";
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

describe("User approval flow", () => {
    test("should approve user successfully", async () => {
        const response = await request(app)
            .post("/user")
            .send({ userId: "validUserId" });
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "User approved successfully");
    });

    test("should fail to approve a non-existent user", async () => {
        const response = await request(app)
            .post("/user")
            .send({ userId: "nonExistentUserId" });
        
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("error", "User not found");
    });

    test("should not approve an already approved user", async () => {
        const response = await request(app)
            .post("/user")
            .send({ userId: "alreadyApprovedUserId" });
        
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error", "User is already approved");
    });

    test("should check permissions for user approval", async () => {
        const response = await request(app)
            .post("/user")
            .send({ userId: "validUserId" })
            .set("Authorization", "Bearer invalidToken");
        
        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty("error", "Permission denied");
    });

    test("should validate user ID format", async () => {
        const response = await request(app)
            .post("/user")
            .send({ userId: "" });
        
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error", "Invalid user ID");
    });
});