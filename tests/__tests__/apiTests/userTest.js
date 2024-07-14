import request from "supertest";
import app from "../../../app/app.js";
import Connection from "../../../app/db/connection.js";
import logTestSuite from "../../util.js";
import {
  validUserLoginRaisa,
  validUserLoginEthan,
  invalidUserLoginEthan,
  invalidUserLoginRaisa,
  pendingUserLoginAce,
  validUserSignup,
  existingUsernameSignup,
  existingEmailSignup,
  validUsernameQueryRaisa,
  validUsernameQueryEthan,
  userToApprove1,
  userToApprove2,
  userToApprove3,
  userToApprove4,
  userToDeny1,
  userToDeny2,
  userToDeny3,
  userToDeny4,
} from "../../testData/userTestData.js";
import tokens from "../../testData/tokenTestData.js";

afterAll(async () => {
  await Connection.close();
});

describe("User Login Tests", () => {
  test("should login a valid user Raisa", async () => {
    const response = await request(app).post("/user/login").send(validUserLoginRaisa);

    logTestSuite.user && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Login successful");
    expect(response.headers["set-cookie"]).toBeDefined();
  });

  test("should login a valid user Ethan", async () => {
    const response = await request(app).post("/user/login").send(validUserLoginEthan);

    logTestSuite.user && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Login successful");
    expect(response.headers["set-cookie"]).toBeDefined();
  });

  test("should not login with incorrect password for Ethan", async () => {
    const response = await request(app).post("/user/login").send(invalidUserLoginEthan);

    logTestSuite.user && console.log(response.body);
    expect(response.status).toBe(400);
  });

  test("should not login with incorrect password for Raisa", async () => {
    const response = await request(app).post("/user/login").send(invalidUserLoginRaisa);

    logTestSuite.user && console.log(response.body);
    expect(response.status).toBe(400);
  });

  test("should not login with non-existent username", async () => {
    const response = await request(app).post("/user/login").send({
      username: "nonexistentuser",
      password: "password",
    });

    logTestSuite.user && console.log(response.body);
    expect(response.status).toBe(404);
  });

  test("should not login if user is unapproved", async () => {
    const response = await request(app).post("/user/login").send(pendingUserLoginAce);

    logTestSuite.user && console.log(response.body);
    expect(response.status).toBe(400);
  });
});

describe("User Signup Tests", () => {
  test("should signup a new user successfully", async () => {
    const response = await request(app).post("/user/signup").send(validUserSignup);

    logTestSuite.user && console.log(response.body);
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Signup successful");
  });

  test("should not signup with existing username", async () => {
    const response = await request(app).post("/user/signup").send(existingUsernameSignup);

    logTestSuite.user && console.log(response.body);
    expect(response.status).toBe(400);
  });

  test("should not signup with existing email", async () => {
    const response = await request(app).post("/user/signup").send(existingEmailSignup);

    logTestSuite.user && console.log(response.body);
    expect(response.status).toBe(400);
  });
});

describe("Get User By Username Tests", () => {
  test("get a user by a valid/existing username raisa", async () => {
    const response = await request(app).get("/user/username/raisa");

    logTestSuite.user && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(validUsernameQueryRaisa);
    expect(response.body.username).toBe("raisa");
  });

  test("get a user by a valid/existing username ethan", async () => {
    const response = await request(app).get("/user/username/ethan");

    logTestSuite.user && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(validUsernameQueryEthan);
    expect(response.body.username).toBe("ethan");
  });

  test("attempt getting an invalid username", async () => {
    const response = await request(app).get("/user/username/nonexistentuser");

    logTestSuite.user && console.log(response.body);
    expect(response.body).toStrictEqual({ error: "User not found." });
    expect(response.status).toBe(404);
  });
});

describe("Approve or deny given users test", () => {
  test("test only approving users", async () => {
    //sign up new users to approve
    const response0 = await request(app).post("/user/signup").send(userToApprove1);
    console.log("response signup: ", response0.body);
    

    const listOfUsers = {
      approve: ["ace", "approve2"],
      deny: [],
    };

    const response = await request(app)
      .put("/user/resolve-status")
      .send(listOfUsers)
      .set("Cookie", [`token=${tokens.ethan}`]);

    logTestSuite.user && console.log(response.body);
    expect(response.status).toBe(201);
    expect(response.body).toStrictEqual({"message": "All users resolved successfully."});

    //check status of the users to ensure they have been approved
    const aceUser = await request(app).get("/user/username/ace");
    const approveUser1 = await request(app).get("/user/username/approve1");
    console.log(aceUser.body);
    console.log(approveUser1.body);

  });

  // test("test only denying users", async () => {
  //   //sign up a new user to deny
  //   await request(app).post("/user/signup").send(validUserSignup);

  //   const listOfUsers = {
  //     approve: [],
  //     deny: ["newuser"],
  //   };

  //   const response = await request(app)
  //     .put("/user/resolve-status")
  //     .send(listOfUsers)
  //     .set("Cookie", [`token=${tokens.ethan}`]);

  //   logTestSuite.user && console.log(response.body);
  //   expect(response.status).toBe(201);
  //   expect(response.body).toStrictEqual({"message": "All users resolved successfully."});
  // });

});
