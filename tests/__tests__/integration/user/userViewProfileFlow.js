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

describe("User view profile flow", () => {
    test("should view profile successfully with valid user ID", async () => {
        const response = await request(app)
            .get("/user")
            .set("Authorization", "Bearer validToken");
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("username", "validUser"); 
        expect(response.body).toHaveProperty("email");
    });

    test("should fail to view a non-existent profile", async () => {
        const response = await request(app)
            .get("/user")
            // .set("Authorization", "Bearer validToken");
        
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("error", "Profile not found");
    });

    test("should not allow unauthorized access to another user's profile", async () => {
        const response = await request(app)
            .get("")
            .set("Authorization", "Bearer invalidToken");
        
        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty("error", "Unauthorized access");
    });

    // test("should return expected profile data structure", async () => {
    //     const response = await request(app)
    //         .get("/user")
    //         .set("Authorization", "Bearer validToken");
        
    //     expect(response.status).toBe(200);
    //     expect(response.body).toEqual(expect.objectContaining({
    //         username: expect.any(String),
    //         email: expect.any(String),
    //     }));
    // });

    test("should allow user to view their own profile", async () => {
        const response = await request(app)
            .get("/user")
            .set("Authorization", "Bearer validToken");
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("username", "ownUser");
    });
});