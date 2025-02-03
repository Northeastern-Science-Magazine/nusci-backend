import request from "supertest";
import app from "../../../../app/app.js";
import tokens from "../../../testData/tokenTestData.js";
import { log } from "../../../testConfig.js";
import { executeReset, injectMockConnection, closeMockConnection } from "../../../util/util.js";
import PhotoAccessor from "../../../../app/databaseAccessors/photo.accessor.js";

const showLog = __filename
  .replace(".js", "")
  .split(/[/\\]/)
  .splice(__filename.split(/[/\\]/).lastIndexOf("__tests__") + 1)
  .reduce((acc, key) => acc && acc[key], log);
beforeEach(injectMockConnection);
beforeEach(executeReset);
afterAll(closeMockConnection);

describe("Delete PhotoTags Test", () => {
  const validTag = {
    tagName: "Clouds",
    color: "#4CAF51",
    creatingUser: "b00000000000000000000001",
    creationTime: new Date("2024-04-06"),
    modificationTime: new Date("2024-04-07"),
  };

  test("Tag deleted successfully", async () => {
    const existingTag = await request(app)
      .post("/photo-tag/create")
      .set("Cookie", [`token=${tokens["raisa@raisa.com"]}`])
      .send(validTag);
    showLog && console.log(existingTag.body);
    expect(existingTag.statusCode).toBe(201);

    const deleteTag = await request(app)
      .delete("/photo-tag/delete/Clouds")
      .set("Cookie", [`token=${tokens["raisa@raisa.com"]}`]);
    showLog && console.log(deleteTag.body);
    expect(existingTag.body).toStrictEqual(deleteTag.body);
    expect(deleteTag.statusCode).toBe(200);

    //create same tag as before and should work without problem
    const newTag = await request(app)
      .post("/photo-tag/create")
      .set("Cookie", [`token=${tokens["raisa@raisa.com"]}`])
      .send(validTag);
    showLog && console.log(newTag.body);
    expect(newTag.statusCode).toBe(201);
  });

  test("Deleting an invalid photoTag", async () => {
    const deleteTag = await request(app)
      .delete("/photo-tag/delete/Nonexistent")
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`]);
    showLog && console.log(deleteTag.body);
    expect(deleteTag.statusCode).toBe(404);
  });

  test("Deleting photoTag has cascading effects", async () => {
    // 'Nature' tag exists in the database
    const PhotosWithTag = await PhotoAccessor.getPhotosByTag("f00000000000000000000000");
    PhotosWithTag.forEach(photo => {
      // Check that the 'tags' array does not contain the deleted tag
      expect((photo.tags).includes("f00000000000000000000000")).toBe(true);
    });
    const deleteTag = await request(app)
      .delete("/photo-tag/delete/Nature")
      .set("Cookie", [`token=${tokens["ethan@ethan.com"]}`]);
    showLog && console.log(deleteTag.body);
    // no photos with 'Nature' tag 
    const currPhotosWithTag = await PhotoAccessor.getPhotosByTag(deleteTag._id);
    expect(deleteTag.statusCode).toBe(200);
    expect(currPhotosWithTag).toStrictEqual([]);
    });
});
