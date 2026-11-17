import { test, beforeEach, afterEach, describe } from "node:test";
import assert from "node:assert/strict";
import sinon from "sinon";
import orderController from "../../src/modules/order/order.controller.js";
import authUtil from "../../src/utils/authorize.util.js";
import hashIdUtil from "../../src/utils/hashId.util.js";
import orderService from "../../src/modules/order/order.services.js";
import notificationQueue from "../../src/jobs/queues/notification.queue.js";
import { sequelize } from "../../src/configs/database.js";
import { AppError } from "../../src/utils/error.class.js";

function mockReqRes(
  auth = { id: 1, relatedId: 10, role: "client" },
  body = {},
  params = {},
  query = {}
) {
  return {
    req: { auth, body, params, query },
    res: { send: sinon.stub() },
    next: sinon.stub(),
  };
}

let sandbox;

beforeEach(() => {
  sandbox = sinon.createSandbox();
});

afterEach(() => {
  sandbox.restore();
});

describe("testing order controllers", () => {
  test("payOrder → should send success with the service message", async () => {
    const { req, res, next } = mockReqRes();
    sandbox.stub(authUtil, "checkRoleAndPermission").resolves();
    sandbox
      .stub(orderService, "payOrder")
      .resolves("order created successfully");

    await orderController.payOrder(req, res, next);

    assert.ok(orderService.payOrder.calledOnceWith(req));
    assert.ok(res.send.calledOnce);
    assert.match(res.send.firstCall.args[0].message, /order created/);
    assert.equal(next.called, false);
  });

  test("payOrder → should call next when the service rejects", async () => {
    const { req, res, next } = mockReqRes();
    sandbox.stub(authUtil, "checkRoleAndPermission").resolves();
    sandbox
      .stub(orderService, "payOrder")
      .rejects(new AppError(403, "permission denied", true, "permission denied"));

    await orderController.payOrder(req, res, next);

    assert.ok(next.calledOnce);
    assert.ok(next.firstCall.args[0] instanceof AppError);
    assert.equal(res.send.called, false);
  });

  test("getOrdersSP → should send the provider orders", async () => {
    const { req, res, next } = mockReqRes({
      id: 1,
      relatedId: 10,
      role: "service_provider_root",
    });
    sandbox.stub(authUtil, "checkRoleAndPermission").resolves();
    const getOrdersStub = sandbox
      .stub(orderService, "getOrdersForSP")
      .resolves({ data: [{ id: 1 }] });

    await orderController.getOrdersSP(req, res, next);

    assert.ok(getOrdersStub.calledOnceWith(10, req.query));
    assert.ok(res.send.calledOnce);
    assert.equal(next.called, false);
  });

  test("getOrdersClient → should send the client orders", async () => {
    const { req, res, next } = mockReqRes();
    sandbox.stub(authUtil, "checkRoleAndPermission").resolves();
    const getOrdersStub = sandbox
      .stub(orderService, "getOrdersForClient")
      .resolves({ data: [{ id: 2 }] });

    await orderController.getOrdersClient(req, res, next);

    assert.ok(getOrdersStub.calledOnceWith(1, req.query));
    assert.ok(res.send.calledOnce);
    assert.equal(next.called, false);
  });

  test("serviceProviderCloseOrder → should close the order and queue the notification", async () => {
    const { req, res, next } = mockReqRes({
      id: 1,
      relatedId: 10,
      role: "service_provider_root",
    });
    req.params = { orderId: "abc123" };
    const tMock = { commit: sinon.stub(), rollback: sinon.stub() };
    sandbox.stub(sequelize, "transaction").resolves(tMock);
    sandbox.stub(authUtil, "checkRoleAndPermission").resolves({ id: 1 });
    sandbox.stub(hashIdUtil, "hashIdDecode").returns(77);
    sandbox.stub(orderService, "serviceProviderCloseOrder").resolves();
    const queueStub = sandbox.stub(notificationQueue, "add").resolves();

    await orderController.serviceProviderCloseOrder(req, res, next);

    assert.ok(orderService.serviceProviderCloseOrder.calledOnce);
    assert.ok(queueStub.calledOnce);
    assert.ok(tMock.commit.calledOnce);
    assert.ok(res.send.calledOnce);
    assert.equal(next.called, false);
  });

  test("serviceProviderCloseOrder → should rollback and call next on failure", async () => {
    const { req, res, next } = mockReqRes({
      id: 1,
      relatedId: 10,
      role: "service_provider_root",
    });
    req.params = { orderId: "abc123" };
    const tMock = { commit: sinon.stub(), rollback: sinon.stub() };
    sandbox.stub(sequelize, "transaction").resolves(tMock);
    sandbox.stub(authUtil, "checkRoleAndPermission").resolves({ id: 1 });
    sandbox.stub(hashIdUtil, "hashIdDecode").returns(77);
    sandbox
      .stub(orderService, "serviceProviderCloseOrder")
      .rejects(new Error("close failed"));

    await orderController.serviceProviderCloseOrder(req, res, next);

    assert.ok(tMock.rollback.calledOnce);
    assert.ok(next.calledOnce);
    assert.match(next.firstCall.args[0].message, /close failed/);
    assert.equal(res.send.called, false);
  });

  test("checkIfUserBoughtService → should send the purchase status", async () => {
    const { req, res, next } = mockReqRes();
    req.params = { serviceId: "abc123" };
    sandbox.stub(authUtil, "checkRoleAndPermission").resolves();
    const boughtStub = sandbox
      .stub(orderService, "checkIfUserBoughtService")
      .resolves({ bought: true });

    await orderController.checkIfUserBoughtService(req, res, next);

    assert.ok(
      boughtStub.calledOnceWith({ userId: 1, serviceId: "abc123" })
    );
    assert.ok(res.send.calledOnce);
    assert.equal(next.called, false);
  });
});
