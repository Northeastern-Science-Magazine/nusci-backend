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

describe("User logging in flow", () => {
    test("should log in successfully with valid credentials", async () => {
        const response = await request(app)
            .post("/auth") 
            .send({ username: "validUser", password: "validPassword" });
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("token");
    });

    test("should fail to log in with invalid credentials", async () => {
        const response = await request(app)
            .post("/auth")
            .send({ username: "validUser", password: "invalidPassword" });
        
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("error", "Invalid credentials");
    });

    test("should fail to log in with missing credentials", async () => {
        const response = await request(app)
            .post("/auth")
            .send({ username: "", password: "" });
        
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error", "Username and password are required");
    });

    test("should lock account after multiple failed login attempts", async () => {
        for (let i = 0; i < 5; i++) {
            await request(app)
                .post("/auth")
                .send({ username: "validUser", password: "wrongPassword" });
        }

        const response = await request(app)
            .post("/auth")
            .send({ username: "validUser", password: "validPassword" });
        
        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty("error", "Account locked due to multiple failed attempts");
    });

    test("should create a session upon successful login", async () => {
        const response = await request(app)
            .post("/auth")
            .send({ username: "validUser", password: "validPassword" });
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("sessionId");
    });

    test("should log out successfully", async () => {
        const loginResponse = await request(app)
            .post("/auth")
            .send({ username: "validUser", password: "validPassword" });
        
        const response = await request(app)
            .post("/auth")
            .set("Authorization", `Bearer ${loginResponse.body.token}`);
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "Logged out successfully");
    });

    test("should validate username and password format", async () => {
        const response = await request(app)
            .post("/auth")
            .send({ username: "u", password: "p" });
        
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error", "Username and password must be at least 3 characters long");
    });

    test("should enforce rate limiting on login attempts", async () => {
        for (let i = 0; i < 5; i++) {
            await request(app)
                .post("/auth")
                .send({ username: "validUser", password: "wrongPassword" });
        }

        const response = await request(app)
            .post("/auth")
            .send({ username: "validUser", password: "validPassword" });
        
        expect(response.status).toBe(429);
        expect(response.body).toHaveProperty("error", "Too many login attempts. Please try again later.");
    });
});