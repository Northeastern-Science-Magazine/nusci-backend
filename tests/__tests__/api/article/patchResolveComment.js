import { execSync } from "child_process";
import request from "supertest";
import app from "../../../../app/app.js";
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

describe("Article Resolve Internal Comment Tests", () => {
    test("valid comment resolve (admin)", async () => {
        const response = await request(app)
            .patch("/articles/resolve-internal-comment")
            .send({ commentId: "" }) //TODO fill
            .set("Cookie", [`token=${tokens.ethan}`]);

        showLog && console.log(response.body);
        expect(response.status).toBe(201);
        expect(response.body.comments[0].commentStatus).toBe("resolved"); // FIX
    });

    test("invalid resolve comment (invalid login)", async () => {
        const response = await request(app)
            .patch("/articles/resolve-internal-comment")
            .send({ commentId: "" }) // TODO fill
            .set("Cookie", [`token=${tokens.arushi}`]);

        showLog && console.log(response.body);
        expect(response.status).toBe(403);
        expect(response.body).toStrictEqual({ error: "User is incorrect." });
    });
});