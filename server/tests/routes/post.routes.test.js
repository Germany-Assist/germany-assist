import { describe, it, beforeEach, after } from "node:test";
import { app } from "../../src/app.js";
import request from "supertest";
import { errorLogger } from "../../src/utils/loggers.js";
import { initDatabase } from "../../src/database/migrateAndSeed.js";
import assert from "node:assert";
import { fullServiceFactory } from "../factories/service.factory.js";
import hashIdUtil from "../../src/utils/hashId.util.js";
import db from "../../src/database/index.js";

beforeEach(async () => {
  try {
    await initDatabase(false);
  } catch (error) {
    errorLogger(error);
  }
});
async function retrievePost(filters) {
  try {
    return await db.Post.findOne({ where: filters });
  } catch (error) {
    console.log(error);
  }
}
after(async () => {
  try {
    await app?.close();
  } catch (error) {
    errorLogger(error);
  }
});
describe("api/post - post - testing create new post", () => {
  it("should create new post successfully", async () => {
    const { SP, timeline } = await fullServiceFactory();
    const examplePost = {
      timelineId: hashIdUtil.hashIdEncode(timeline.id),
      description: "please send your email by the end of the day",
      isPinned: false,
    };
    const res = await request(app)
      .post("/api/post/createNewPost")
      .set("Authorization", `Bearer ${SP.accessToken}`)
      .send(examplePost);
    assert.equal(res.status, 201);
    assert.deepEqual(res.body, {
      success: true,
      message: "Created Post Successfully",
    });
    const post = await retrievePost({ timelineId: timeline.id });
    assert.equal(post.description, examplePost.description);
  });
  it("should fail for validation errors", async () => {
    const { SP } = await fullServiceFactory();
    const examplePost = {
      timelineId: "",
      description: "",
      isPinned: "",
    };
    const res = await request(app)
      .post("/api/post/createNewPost")
      .set("Authorization", `Bearer ${SP.accessToken}`)
      .send(examplePost);
    assert.equal(res.status, 422);
    const errors = res.body.message.errors;
    assert.ok(errors.some((e) => e.path === "description"));
    assert.ok(errors.some((e) => e.path === "timelineId"));
  });
});
