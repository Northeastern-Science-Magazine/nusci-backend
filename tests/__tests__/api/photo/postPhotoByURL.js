import request from "supertest";
import app from "../../../../app/app.js";
import tokens from "../../../testData/tokenTestData.js";
import { log } from "../../../testConfig.js";
import { executeReset, injectMockConnection, closeMockConnection } from "../../../util/util.js";
import { userResponseEthan, userResponseRaisa } from "../../../testData/userTestData.js";

const showLog = __filename
  .replace(".js", "")
  .split(/[/\\]/)
  .splice(__filename.split(/[/\\]/).lastIndexOf("__tests__") + 1)
  .reduce((acc, key) => acc && acc[key], log);
beforeEach(injectMockConnection);
beforeEach(executeReset);
afterAll(closeMockConnection);

describe("Create Photos Test", () => {
  const validPhoto = {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRd14iSERX2EDERqpulNP0RyrgxRw2x5Ju1Dw&s",
    tags: ["Nature"],
    photographers: ["ethan@ethan.com"],
    photoTime: new Date("2024-01-22"),
    rights: "All rights reserved",
    creationTime: new Date("2024-01-22"),
    modificationTime: new Date("2024-01-22"),
  };

  const expectedValidPhoto = {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRd14iSERX2EDERqpulNP0RyrgxRw2x5Ju1Dw&s",
    tags: ["Nature"],
    photographers: [userResponseEthan],
    photoTime: new Date("2024-01-22"),
    rights: "All rights reserved",
    creationTime: new Date("2024-01-22"),
    modificationTime: new Date("2024-01-22"),
  };

  const validPhoto2 = {
    url: "https://cdn.britannica.com/73/9173-004-56D81BC8.jpg",
    tags: ["Nature"],
    photographers: ["raisa@raisa.com", "ethan@ethan.com"],
    photoTime: new Date("2024-01-21"),
    rights: "All rights reserved",
    creationTime: new Date("2024-01-21"),
    modificationTime: new Date("2024-01-21"),
  };

  const expectedValidPhoto2 = {
    url: "https://cdn.britannica.com/73/9173-004-56D81BC8.jpg",
    tags: ["Nature"],
    photographers: [userResponseEthan, userResponseRaisa],
    photoTime: new Date("2024-01-21"),
    rights: "All rights reserved",
    creationTime: new Date("2024-01-21"),
    modificationTime: new Date("2024-01-21"),
  };

  const validPhoto3 = {
    url: "https://www.pond-planet.co.uk/blog/wp-content/uploads/2023/12/Untitled-91.png",
    tags: ["Travel", "Food", "Technology"],
    photographers: ["raisa@raisa.com"],
    photoTime: new Date("2024-01-21"),
    rights: "All rights reserved",
    creationTime: new Date("2024-01-21"),
    modificationTime: new Date("2024-01-21"),
  };

  const expectedValidPhoto3 = {
    url: "https://www.pond-planet.co.uk/blog/wp-content/uploads/2023/12/Untitled-91.png",
    tags: ["Travel", "Food", "Technology"],
    photographers: [userResponseRaisa],
    photoTime: new Date("2024-01-21"),
    rights: "All rights reserved",
    creationTime: new Date("2024-01-21"),
    modificationTime: new Date("2024-01-21"),
  };

  const invalidPhoto = {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRd14iSERX2EDERqpulNP0RyrgxRw2x5Ju1Dw&s",
    tags: ["Nature"],
    photographers: ["invalid@email.com"],
    photoTime: new Date("2024-01-22"),
    rights: "All rights reserved",
    creationTime: new Date("2024-01-22"),
    modificationTime: new Date("2024-01-22"),
  };

  test("Invalid photo creation due to invalid photographer email", async () => {
    const response = await request(app)
    .post(`/photo/upload/url`)
    .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
    .send(invalidPhoto);
    showLog && console.log(response);
    expect(response.status).toBe(404);
    const errorMessage = JSON.parse(response.text).error;
    expect(errorMessage).toStrictEqual("Invalid request body.");
  });
  

  test("Photo created successfully", async () => {
    const response = await request(app)
      .post(`/photo/upload/url`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send(validPhoto);
    showLog && console.log(response.body);
    expect(response.statusCode).toBe(201);

    expect(response.body.url).toBe(expectedValidPhoto.url);
    //expect(response.body.tags).toStrictEqual(expectedValidPhoto.tags);
    expect(response.body.photographers).toStrictEqual(expectedValidPhoto.photographers);
    expect(response.body.photoTime).toBeDefined();
    expect(response.body.rights).toBe(expectedValidPhoto.rights);
    expect(response.body.creationTime).toBeDefined();
    expect(response.body.modificationTime).toBeDefined();
  });

  test("Photo created successfully", async () => {
    const response = await request(app)
      .post(`/photo/upload/url`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send(validPhoto2);
    showLog && console.log(response.body);
    expect(response.statusCode).toBe(201);

    expect(response.body.url).toBe(expectedValidPhoto2.url);
    //expect(response.body.tags).toBe(expectedValidPhoto2.tags);
    expect(response.body.photographers).toStrictEqual(expectedValidPhoto2.photographers);
    expect(response.body.photoTime).toBeDefined();
    expect(response.body.rights).toBe(expectedValidPhoto2.rights);
    expect(response.body.creationTime).toBeDefined();
    expect(response.body.modificationTime).toBeDefined();
  });

  test("Photo created successfully", async () => {
    const response = await request(app)
      .post(`/photo/upload/url`)
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
      .send(validPhoto3);
    showLog && console.log(response.body);
    expect(response.statusCode).toBe(201);

    expect(response.body.url).toBe(expectedValidPhoto3.url);
    //expect(response.body.tags).toBe(expectedValidPhoto3.tags);
    expect(response.body.photographers).toStrictEqual(expectedValidPhoto3.photographers);
    expect(response.body.photoTime).toBeDefined();
    expect(response.body.rights).toBe(expectedValidPhoto3.rights);
    expect(response.body.creationTime).toBeDefined();
    expect(response.body.modificationTime).toBeDefined();
  });
});
