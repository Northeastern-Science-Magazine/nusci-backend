import { execSync } from "child_process";
import request from "supertest";
import app from "../../../../app/app.js";
import Connection from "../../../../app/db/connection.js";
import { log } from "../../../testConfig.js";
import { deserialize } from "v8";

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
  test("no options", async () => {
    const response = await request(app)
      .get(`/articles/search`)
      .send({});

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.length).toEqual(6);
  });

  test("valid issue number", async () => {
    const response = await request(app)
      .get(`/articles/search`)
      .send({issueNumber: "3"});

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body[0].slug).toEqual("world-death-rate-holding-steady-at-100-percent-2");
  });

  test("valid authors", async () => {
    const response = await request(app)
      .get(`/articles/search`)
      .send({authors: ["jasmine@jasmine.com"]});      

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.length).toEqual(6);
  });

  test("valid editors", async () => {
    const response = await request(app)
      .get(`/articles/search`)
      .send({editors: ["noah@noah.com", "nethra@nethra.com"]});      

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.length).toEqual(6);
  });

  test("valid designers", async () => {
    const response = await request(app)
      .get(`/articles/search`)
      .send({designers: ["vianna@vianna.com"]});

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.length).toEqual(6);
  });

  test("valid photographers", async () => {
    const response = await request(app)
      .get(`/articles/search`)
      .send({photographers: ["jiajia@jiajia.com"]});

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.length).toEqual(6);
  });

  test("valid slug", async () => {
    const response = await request(app)
      .get(`/articles/search`)
      .send({slug: "exploring-the-future-ai-integration-in-everyday-life"});

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.length).toEqual(1);
    expect(response.body[0].title).toEqual("Exploring the Future: AI Integration in Everyday Life");
  });

  test("valid categories", async () => {
    const response = await request(app)
      .get(`/articles/search`)
      .send({categories: ["technology"]});

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.length).toEqual(2);
  });

  test("valid before date", async () => {
    const response = await request(app)
      .get(`/articles/search`)
      .send({before: new Date("2024-03-27")});
      //.send({before: '2024-04-02T04:00:00.000Z'});

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.length).toEqual(2);
  });

  test("valid after date", async () => {
    const response = await request(app)
      .get(`/articles/search`)
      .send({after: new Date("2024-03-29")});

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.length).toEqual(4);
  });

  test("valid both dates", async () => {
    const response = await request(app)
      .get(`/articles/search`)
      .send({before: new Date("2024-04-2")})
      .send({after: new Date("2024-03-30")});

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.length).toEqual(2);
  });

  test("valid limit", async () => {
    const response = await request(app)
      .get(`/articles/search`)
      .send({limit: "3"});

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.length).toEqual(3);
  });

  test("resulting query returns []", async () => {
    const response = await request(app)
      .get(`/articles/search`)
      .send({issueNumber: "3", editors: ["nethra@nethra.com"]});

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test("providing 3-5 compounding options", async () => {
    const response = await request(app)
      .get(`/articles/search`)
      .send({editors: ["noah@noah.com"], categories: ["technology"], photographers: ["jiajia@jiajia.com"]});

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.length).toEqual(2);
    expect(response.body[0].title).toEqual('Exploring the Future: AI Integration in Everyday Life');
    expect(response.body[1].title).toEqual('Mark S. W. Sweess reflects on success, creativity, making mistakes and his time at Northeastern');
  });
  /*
  test("providing every single search option", async () => {
    const response = await request(app)
      .get(`/articles/search`)
      .send({issueNumber: "1", authors: [""], editors: [""], designers: [""], photographers: [""], slug: "", categories: [""], before: "", after: ""});

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
  */
  test("invalid issue number", async () => {
    const response = await request(app)
      .get(`/articles/search`)
      .send({issueNumber: "8"});

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test("invalid authors", async () => {
    const response = await request(app)
      .get(`/articles/search`)
      .send({authors: ["arushi@arushi.com"]});

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test("invalid editors", async () => {
    const response = await request(app)
      .get(`/articles/search`)
      .send({editors: ["arushi@arushi.com"]});

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test("invalid designers", async () => {
    const response = await request(app)
      .get(`/articles/search`)
      .send({designers: ["arushi@arushi.com", "raisa@raisa.com"]});

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test("invalid photographers", async () => {
    const response = await request(app)
      .get(`/articles/search`)
      .send({photographers: ["arushi@arushi.com", "raisa@raisa.com"]});

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test("invalid slug", async () => {
    const response = await request(app)
      .get(`/articles/search`)
      .send({slug: "this-is-not-a-slug"});

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test("invalid categories", async () => {
    const response = await request(app)
      .get(`/articles/search`)
      .send({categories: ["coolness", "craziness"]});

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test("valid invalid both dates", async () => {
    const response = await request(app)
      .get(`/articles/search`)
      .send({after: new Date("2024-04-2")})
      .send({before: new Date("2024-03-31")});

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.length).toEqual(0);
  });

});  