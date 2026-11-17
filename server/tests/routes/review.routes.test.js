import { describe, it, beforeEach, after } from "node:test";
import { app } from "../../src/app.js";
import request from "supertest";
import { errorLogger } from "../../src/utils/loggers.js";
import { initDatabase } from "../../src/database/migrateAndSeed.js";
import assert from "node:assert";
import { userWithTokenFactory } from "../factories/user.factory.js";
import { fullServiceFactory } from "../factories/service.factory.js";
import { orderFactory } from "../factories/order.factory.js";
import hashIdUtil from "../../src/utils/hashId.util.js";
import db from "../../src/database/index.js";

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

describe("api/review - post - testing send review path", () => {
  it("should create a review for a purchased service", async () => {
    const { service, timeline, SP } = await fullServiceFactory();
    const client = await userWithTokenFactory();
    await orderFactory({
      userId: client.user.id,
      timelineId: timeline.id,
      serviceId: service.id,
      serviceProviderId: SP.serviceProvider.id,
    });
    const payload = {
      id: hashIdUtil.hashIdEncode(service.id),
      rating: 5,
      body: "excellent service, highly recommended",
    };
    const res = await request(app)
      .post("/api/review")
      .set("Authorization", `Bearer ${client.accessToken}`)
      .send(payload);
    assert.equal(res.status, 201);
    const review = await db.Review.findOne({
      where: { serviceId: service.id, userId: client.user.id },
    });
    assert.ok(review, "review should be persisted");
    assert.equal(review.rating, 5);
    assert.equal(review.body, payload.body);
  });

  it("should fail to review a service the client did not buy", async () => {
    const { service } = await fullServiceFactory();
    const client = await userWithTokenFactory();
    const res = await request(app)
      .post("/api/review")
      .set("Authorization", `Bearer ${client.accessToken}`)
      .send({
        id: hashIdUtil.hashIdEncode(service.id),
        rating: 5,
        body: "did not buy this",
      });
    assert.equal(res.status, 403);
    const review = await db.Review.findOne({
      where: { serviceId: service.id, userId: client.user.id },
    });
    assert.equal(review, null);
  });

  it("should fail for invalid rating", async () => {
    const { service, timeline, SP } = await fullServiceFactory();
    const client = await userWithTokenFactory();
    await orderFactory({
      userId: client.user.id,
      timelineId: timeline.id,
      serviceId: service.id,
      serviceProviderId: SP.serviceProvider.id,
    });
    const res = await request(app)
      .post("/api/review")
      .set("Authorization", `Bearer ${client.accessToken}`)
      .send({
        id: hashIdUtil.hashIdEncode(service.id),
        rating: 42,
        body: "bad rating",
      });
    assert.equal(res.status, 422);
    const review = await db.Review.findOne({
      where: { serviceId: service.id, userId: client.user.id },
    });
    assert.equal(review, null);
  });

  it("should require authentication", async () => {
    const { service } = await fullServiceFactory();
    const res = await request(app)
      .post("/api/review")
      .send({
        id: hashIdUtil.hashIdEncode(service.id),
        rating: 5,
        body: "unauthenticated",
      });
    assert.equal(res.status, 401);
  });
});
