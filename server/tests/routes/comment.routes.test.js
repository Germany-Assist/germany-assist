import { describe, it, beforeEach, after } from "node:test";
import { app } from "../../src/app.js";
import request from "supertest";
import { errorLogger } from "../../src/utils/loggers.js";
import { initDatabase } from "../../src/database/migrateAndSeed.js";
import assert from "node:assert";
import { userWithTokenFactory } from "../factories/user.factory.js";
import { fullPostFactory } from "../factories/service.factory.js";
import hashIdUtil from "../../src/utils/hashId.util.js";
import { orderFactory } from "../factories/order.factory.js";
import db from "../../src/database/index.js";

const retrieveComment = async (filters) => {
  try {
    return await db.Comment.findOne({
      where: filters,
    });
  } catch (error) {
    console.log(error);
  }
};
beforeEach(async () => {
  try {
    await initDatabase(false);
  } catch (error) {
    errorLogger(error);
  }
});
after(async () => {
  try {
    await app?.close();
  } catch (error) {
    errorLogger(error);
  }
});
describe("api/post/comment - post - testing comment routes", () => {
  it("should create comment successfully and create a reply", async () => {
    const { post, service, timeline, SP } = await fullPostFactory();
    const client = await userWithTokenFactory();
    const order = await orderFactory({
      userId: client.user.id,
      timelineId: timeline.id,
      serviceId: service.id,
      serviceProviderId: SP.serviceProvider.id,
    });
    const commentExample = {
      commentBody: "great product",
      postId: hashIdUtil.hashIdEncode(post.id),
    };
    const res = await request(app)
      .post("/api/post/comment/")
      .set("Authorization", `Bearer ${client.accessToken}`)
      .send(commentExample);
    assert.ok(res.body);
    assert.equal(res.status, 201);
    const comment = await retrieveComment({
      userId: client.user.id,
      postId: post.id,
    });
    assert.ok(comment);
    assert.equal(comment.body, commentExample.commentBody);
    const replyExample = {
      commentBody: "i disagree",
      postId: hashIdUtil.hashIdEncode(post.id),
      commentId: hashIdUtil.hashIdEncode(comment.id),
    };
    const replyRes = await request(app)
      .post("/api/post/comment/")
      .set("Authorization", `Bearer ${client.accessToken}`)
      .send(replyExample);
    assert.ok(replyRes.body);
    assert.equal(replyRes.status, 201);
    const reply = await retrieveComment({
      userId: client.user.id,
      postId: post.id,
      parentId: comment.id,
    });
    assert.ok(reply);
    assert.equal(reply.body, replyExample.commentBody);
  });
  it("should fail for not buying the timeline", async () => {
    const { post } = await fullPostFactory();
    const client = await userWithTokenFactory();
    const commentExample = {
      commentBody: "great product",
      postId: hashIdUtil.hashIdEncode(post.id),
    };
    const res = await request(app)
      .post("/api/post/comment/")
      .set("Authorization", `Bearer ${client.accessToken}`)
      .send(commentExample);
    assert.deepEqual(res.body, {
      success: false,
      message: "permission denied",
    });
    assert.equal(res.status, 403);
  });
  it("should fail for invalid comment", async () => {
    const { post } = await fullPostFactory();
    const client = await userWithTokenFactory();
    const commentExample = {
      commentBody: "",
      postId: "",
      commentId: "",
    };
    const res = await request(app)
      .post("/api/post/comment/")
      .set("Authorization", `Bearer ${client.accessToken}`)
      .send(commentExample);
    const errors = res.body.message.errors;
    assert.ok(errors.some((e) => e.path === "commentBody"));
    assert.ok(errors.some((e) => e.path === "postId"));
    assert.ok(errors.some((e) => e.path === "commentId"));
  });
});
