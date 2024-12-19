// searchArticles.test.js
import request from "supertest";
import app from "../../../../app/app.js";
import {
  validSearchQuery,
  validSearchQuery2,
  validSearchQuery3,
  InvalidSearchQuery,
  InvalidSearchQuery2,
} from "../../../testData/articleTestData.js";
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

/*
These tests pass only when using the cdi tool to connect to the remote atlas database
This is due to the fact that fuzzy search is a only an atlas feature
As these tests will not pass in local environments, they are marked here as skipped by default
*/
describe("Search Articles", () => {
  test.skip("Valid fuzzy search query of title", async () => {
    const response = await request(app).get(`/articles/search/title`).query({ search: validSearchQuery });

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);

    const response2 = await request(app).get(`/articles/search/title`).query({ search: validSearchQuery2 });

    showLog && console.log(response2.body);
    expect(response2.status).toBe(200);
    expect(response2.body.length).toBeGreaterThan(0);

    const response3 = await request(app).get(`/articles/search/title`).query({ search: validSearchQuery3 });

    showLog && console.log(response3.body);
    expect(response3.status).toBe(200);
    expect(response3.body.length).toBeGreaterThan(0);
  });

  test.skip("Valid fuzzy search query of title and content", async () => {
    const response = await request(app).get(`/articles/search/title-and-content`).query({ search: validSearchQuery });

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);

    const response2 = await request(app).get(`/articles/search/title-and-content`).query({ search: validSearchQuery2 });

    showLog && console.log(response2.body);
    expect(response2.status).toBe(200);
    expect(response2.body.length).toBeGreaterThan(0);

    const response3 = await request(app).get(`/articles/search/title-and-content`).query({ search: validSearchQuery3 });

    showLog && console.log(response3.body);
    expect(response3.status).toBe(200);
    expect(response3.body.length).toBeGreaterThan(0);
  });

  test.skip("Invalid search query of title", async () => {
    const response = await request(app).get(`/articles/search/title`).query({ search: InvalidSearchQuery });

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(0);

    const respons2 = await request(app).get(`/articles/search/title`).query({ search: InvalidSearchQuery2 });

    showLog && console.log(respons2.body);
    expect(respons2.status).toBe(200);
    expect(respons2.body.length).toBe(0);
  });

  test.skip("Invalid search query of title and content", async () => {
    const response = await request(app).get(`/articles/search/title-and-content`).query({ search: InvalidSearchQuery });

    showLog && console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(0);

    const response2 = await request(app).get(`/articles/search/title-and-content`).query({ search: InvalidSearchQuery2 });

    showLog && console.log(response2.body);
    expect(response2.status).toBe(200);
    expect(response2.body.length).toBe(0);
  });
});
