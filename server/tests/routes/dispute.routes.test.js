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

describe("api/dispute - post - testing open dispute send path", () => {
  it("should open a dispute for an active order bought by the client", async () => {
    const { service, timeline, SP } = await fullServiceFactory();
    const client = await userWithTokenFactory();
    await orderFactory({
      userId: client.user.id,
      timelineId: timeline.id,
      serviceId: service.id,
      serviceProviderId: SP.serviceProvider.id,
      status: "active",
    });
    const orders = await db.Order.findAll({
      where: { userId: client.user.id },
    });
    assert.equal(orders.length, 1);
    const payload = {
      orderId: hashIdUtil.hashIdEncode(orders[0].id),
      reason: "Service was not delivered as promised",
      description: "The provider did not deliver the agreed milestone",
    };
    const res = await request(app)
      .post("/api/dispute/create")
      .set("Authorization", `Bearer ${client.accessToken}`)
      .send(payload);
    assert.equal(res.status, 201);
    assert.deepEqual(res.body, { success: true });
    const dispute = await db.Dispute.findOne({
      where: { orderId: orders[0].id },
    });
    assert.ok(dispute, "dispute should be persisted");
    assert.equal(dispute.userId, client.user.id);
    assert.equal(dispute.serviceProviderId, SP.serviceProvider.id);
    assert.equal(dispute.reason, payload.reason);
    assert.equal(dispute.description, payload.description);
    assert.equal(dispute.status, "open");
  });

  it("should fail to open a dispute when the order does not belong to the client", async () => {
    const { service, timeline, SP } = await fullServiceFactory();
    const buyer = await userWithTokenFactory();
    const attacker = await userWithTokenFactory();
    const order = await orderFactory({
      userId: buyer.user.id,
      timelineId: timeline.id,
      serviceId: service.id,
      serviceProviderId: SP.serviceProvider.id,
      status: "active",
    });
    const res = await request(app)
      .post("/api/dispute/create")
      .set("Authorization", `Bearer ${attacker.accessToken}`)
      .send({
        orderId: hashIdUtil.hashIdEncode(order.id),
        reason: "not my order",
        description: "attempting to dispute an order I did not buy",
      });
    assert.equal(res.status, 403);
    const dispute = await db.Dispute.findOne({
      where: { orderId: order.id },
    });
    assert.equal(dispute, null, "no dispute should be created");
  });

  it("should fail to open a dispute for an order with an ineligible status", async () => {
    const { service, timeline, SP } = await fullServiceFactory();
    const client = await userWithTokenFactory();
    const order = await orderFactory({
      userId: client.user.id,
      timelineId: timeline.id,
      serviceId: service.id,
      serviceProviderId: SP.serviceProvider.id,
      status: "completed",
    });
    const res = await request(app)
      .post("/api/dispute/create")
      .set("Authorization", `Bearer ${client.accessToken}`)
      .send({
        orderId: hashIdUtil.hashIdEncode(order.id),
        reason: "too late",
        description: "attempting to dispute a completed order",
      });
    assert.equal(res.status, 404);
    const dispute = await db.Dispute.findOne({
      where: { orderId: order.id },
    });
    assert.equal(dispute, null);
  });

  it("should fail for validation errors", async () => {
    const client = await userWithTokenFactory();
    const res = await request(app)
      .post("/api/dispute/create")
      .set("Authorization", `Bearer ${client.accessToken}`)
      .send({ orderId: "", reason: "", description: "" });
    assert.equal(res.status, 422);
    const errors = res.body.message.errors;
    assert.ok(errors.some((e) => e.path === "orderId"));
    assert.ok(errors.some((e) => e.path === "reason"));
    assert.ok(errors.some((e) => e.path === "description"));
  });

  it("should require authentication", async () => {
    const res = await request(app)
      .post("/api/dispute/create")
      .send({
        orderId: "irrelevant",
        reason: "x".repeat(5),
        description: "y".repeat(5),
      });
    assert.equal(res.status, 401);
  });
});
