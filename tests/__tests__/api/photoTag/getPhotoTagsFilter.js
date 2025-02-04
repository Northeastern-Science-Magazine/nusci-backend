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

describe("Filter PhotoTags Test", () => {

  const techTag = {
    _id: 'f00000000000000000000005',
    tagName: 'Technology',
    color: '#009688',
    creatingUser: 'b00000000000000000000007',
    creationTime: '2024-04-06T00:00:00.000Z',
    modificationTime: '2024-04-06T00:00:00.000Z',
    __v: 0
  }

  const natureTag = {
    _id: 'f00000000000000000000000',
    tagName: 'Nature',
    color: '#4CAF50',
    creatingUser: 'b00000000000000000000007',
    creationTime: '2024-04-01T00:00:00.000Z',
    modificationTime: '2024-04-01T00:00:00.000Z',
    __v: 0
  }

  const foodTag = {
    _id: 'f00000000000000000000002',
    tagName: 'Food',
    color: '#FF5722',
    creatingUser: 'b00000000000000000000007',
    creationTime: '2024-04-03T00:00:00.000Z',
    modificationTime: '2024-04-03T00:00:00.000Z',
    __v: 0
  }

    //test with no color and no creating user
    test("no options", async () => {
        const response = await request(app)
        .get(`/photo-tag/filter`).send({})
        .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`]);
    
        showLog && console.log(response.body);
        expect(response.status).toBe(200);
        expect(response.body.length).toEqual(6);
      });

      //test with only color
      test("valid color", async () => {
        const response = await request(app)
        .get(`/photo-tag/filter`)
        .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
        .send({ color: "#FF5722" });
    
        showLog && console.log(response.body);
        expect(response.status).toBe(200);
        expect(response.body.length).toEqual(1);
        expect(response.body[0].color).toBe(foodTag.color);
      });

      // test with only another color 
      test("valid color 2", async () => {
        const response = await request(app)
        .get(`/photo-tag/filter`)
        .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
        .send({ color: "#009688" });
    
        showLog && console.log(response.body);
        expect(response.status).toBe(200);
        expect(response.body.length).toEqual(1);
        expect(response.body[0].color).toBe(techTag.color);
      });

      // test with email 
      test("valid creatingUser", async () => {
        const response = await request(app)
        .get(`/photo-tag/filter`)
        .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
        .send({ userEmail: "vianna%40vianna.com" });
    
        showLog && console.log(response.body);
        expect(response.status).toBe(200);
        expect(response.body.length).toEqual(6);
      });

      // test with email and color 
      test("valid creatingUser and color", async () => {
        const response = await request(app)
        .get(`/photo-tag/filter`)
        .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
        .send({ color: "#4CAF50", userEmail: "vianna%40vianna.com" });
    
        showLog && console.log(response.body);
        expect(response.status).toBe(200);
        expect(response.body.length).toEqual(1);
        expect(response.body[0].color).toBe(natureTag.color);
        expect(response.body[0]._id).toBe(natureTag._id);
       
      });
      
      // test with email and another color 
      test("valid creatingUser and color 2", async () => {
        const response = await request(app)
        .get(`/photo-tag/filter`)
        .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
        .send({ color: "#009688", userEmail: "vianna%40vianna.com" });
    
        showLog && console.log(response.body);
        expect(response.status).toBe(200);
        expect(response.body.length).toEqual(1);
      expect(response.body[0].color).toBe(techTag.color);
      expect(response.body[0]._id).toBe(techTag._id);
        
      });

      test("invalid color", async () => {
        const response = await request(app)
        .get(`/photo-tag/filter`)
        .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
        .send({ color: "fake color" });
    
        showLog && console.log(response.body);
        expect(response.status).toBe(200);
        expect(response.body.length).toEqual(0);
      });

      test("invalid color 2", async () => {
        const response = await request(app)
        .get(`/photo-tag/filter`)
        .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
        .send({ color: "fake color", userEmail: "vianna%40vianna.com" });
    
        showLog && console.log(response.body);
        expect(response.status).toBe(200);
        expect(response.body.length).toEqual(0);
      });

      test("invalid creatingUser", async () => {
        const response = await request(app)
        .get(`/photo-tag/filter`)
        .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
        .send({ userEmail: "fakeemail@gmail.com" });
    
        showLog && console.log(response.body);
        expect(response.status).toBe(404);
        expect(response.body).toStrictEqual({ error: 'User not found.',
          message: 'User not found for email: fakeemail@gmail.com' });
      });

      test("invalid creatingUser 2", async () => {
        const response = await request(app)
        .get(`/photo-tag/filter`)
        .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
        .send({ color: "#009688", userEmail: "fakeemail@gmail.com" });
    
        showLog && console.log(response.body);
        expect(response.status).toBe(404);
        expect(response.body).toStrictEqual({ error: 'User not found.',
          message: 'User not found for email: fakeemail@gmail.com' });
      });

      test("invalid creatingUser and color ", async () => {
        const response = await request(app)
        .get(`/photo-tag/filter`)
        .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`])
        .send({ color: "fake color", userEmail: "fakeemail@gmail.com" });
    
        showLog && console.log(response.body);
        expect(response.status).toBe(404);
        expect(response.body).toStrictEqual({ error: 'User not found.',
          message: 'User not found for email: fakeemail@gmail.com' });
      });
  });