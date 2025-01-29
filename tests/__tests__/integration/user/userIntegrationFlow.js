import request from "supertest";
import app from "../../../../app/app.js";
import { log } from "../../../testConfig.js";
import { executeReset, injectMockConnection, closeMockConnection } from "../../../util/util.js";
import AccountStatus from "../../../../app/models/enums/accountStatus.js";

const showLog = __filename
  .replace(".js", "")
  .split(/[/\\]/)
  .splice(__filename.split(/[/\\]/).lastIndexOf("__tests__") + 1)
  .reduce((acc, key) => acc && acc[key], log);
beforeEach(injectMockConnection);
beforeEach(executeReset);
afterAll(closeMockConnection);

describe("User integration flow", () => {
    test("should complete user account creation, approval, login, and profile request", async () => {
        // Step 1: User creates an account
        const signupResponse = await request(app)
            .post("/user/signup")
            .send({ 
                username: "testuser", 
                password: "testpass",
                status: AccountStatus.Pending.toString(),
                email: "testuser@example.com",
                graduationYear: 2023,
                lastName: "User",
                firstName: "Test"
            });

            console.log("Signup response body:", signupResponse.body);
        
        // Enhanced error handling to log the response body and request details if the status is not 201
        if (signupResponse.status !== 201) {
            console.error("Signup failed:", signupResponse.body);
            console.error("Request body:", { 
                username: "testuser", 
                password: "testpass", 
                status: AccountStatus.Pending.toString(), 
                email: "testuser@example.com", 
                graduationYear: 2023, 
                lastName: "User", 
                firstName: "Test" 
            });
            console.error("Response status:", signupResponse.status);
        }
        
        expect(signupResponse.status).toBe(201);
        expect(signupResponse.body).toHaveProperty("message", "Signup successful.");


        // Step 2: Admin approves the account
        const listOfUsers = {
            approve: [signupResponse.body.userId],
            deny: [],
          };
        console.log("User ID for approval:", listOfUsers); // Log the userId
        const approvalResponse = await request(app)
            .post("/user/resolve-status")
            .send(listOfUsers);
        
        // Enhanced error handling to log the response body if the status is not 200
        if (approvalResponse.status !== 200) {
            console.error("Approval failed:", approvalResponse.body);
            console.error("Request body:", listOfUsers);
            console.error("Response status:", approvalResponse.status);
        }
        
        expect(approvalResponse.status).toBe(200);
        expect(approvalResponse.body).toHaveProperty("message", "User approved successfully");

        // Step 3: User logs into the account
        const loginResponse = await request(app)
            .post("/user/login")
            .send({ username: "testuser", password: "testpass" });
        
        expect(loginResponse.status).toBe(200);
        expect(loginResponse.body).toHaveProperty("token");

        // Step 4: User requests their profile
        const profileResponse = await request(app)
            .get("/user/me")
            .set("Authorization", `Bearer ${loginResponse.body.token}`);
        
        expect(profileResponse.status).toBe(200);
        expect(profileResponse.body).toHaveProperty("username", "testuser");
    });
});
