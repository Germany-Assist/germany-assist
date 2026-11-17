import test, { describe } from "node:test";
import assert from "node:assert/strict";
import sinon from "sinon";
import serviceController from "../../src/modules/service/service.controller.js";
import serviceServices from "../../src/modules/service/service.services.js";
import serviceMappers from "../../src/modules/service/service.mappers.js";
import hashIdUtil from "../../src/utils/hashId.util.js";
import authUtils from "../../src/utils/authorize.util.js";
import { sequelize } from "../../src/configs/database.js";
import { AppError } from "../../src/utils/error.class.js";

describe("Testing Services Controller", () => {
  test("createService → success", async (t) => {
    const sandbox = sinon.createSandbox();

    const fakeTransaction = {
      commit: sandbox.stub().resolves(),
      rollback: sandbox.stub().resolves(),
    };
    sandbox.stub(sequelize, "transaction").resolves(fakeTransaction);
    sandbox.stub(authUtils, "checkRoleAndPermission").resolves();
    sandbox.stub(serviceServices, "createService").resolves({
      id: 1,
      title: "test service",
      UserId: 2,
      categoryId: 3,
      Timelines: [{ id: 10, label: "t1", isArchived: false }],
    });
    sandbox.stub(hashIdUtil, "hashIdEncode").callsFake((id) => `encoded-${id}`);

    const req = {
      auth: { id: 2 },
      body: {},
    };
    const res = {
      status: sandbox.stub().returnsThis(),
      json: sandbox.stub(),
    };
    const next = sandbox.stub();

    await serviceController.createService(req, res, next);

    assert.equal(serviceServices.createService.calledOnce, true);
    assert.equal(fakeTransaction.commit.calledOnce, true);
    assert.equal(fakeTransaction.rollback.called, false);
    assert.equal(res.status.calledWith(201), true);
    assert.equal(next.called, false);

    sandbox.restore();
  });

  test("createService → failure should rollback", async (t) => {
    const sandbox = sinon.createSandbox();

    const fakeTransaction = {
      commit: sandbox.stub().resolves(),
      rollback: sandbox.stub().resolves(),
    };
    sandbox.stub(sequelize, "transaction").resolves(fakeTransaction);
    sandbox.stub(authUtils, "checkRoleAndPermission").resolves();
    sandbox
      .stub(serviceServices, "createService")
      .rejects(new AppError(500, "db error", true));

    const req = {
      auth: { id: 2 },
      body: {},
    };
    const res = {
      status: sandbox.stub().returnsThis(),
      json: sandbox.stub(),
    };
    const next = sandbox.stub();

    await serviceController.createService(req, res, next);

    assert.equal(fakeTransaction.rollback.calledOnce, true);
    assert.equal(next.calledOnce, true);
    assert.ok(next.firstCall.args[0] instanceof AppError);

    sandbox.restore();
  });

  test("getAllServices → success", async (t) => {
    const sandbox = sinon.createSandbox();

    sandbox.stub(serviceServices, "getAllServices").resolves({
      meta: {},
      data: [{ id: 1, title: "service" }],
    });
    sandbox
      .stub(serviceMappers, "sanitizeServices")
      .resolves([{ id: "encoded-1", title: "service" }]);

    const req = { query: {} };
    const res = { status: sandbox.stub().returnsThis(), json: sandbox.stub() };
    const next = sandbox.stub();

    await serviceController.getAllServices(req, res, next);

    assert.equal(serviceServices.getAllServices.calledOnce, true);
    assert.equal(serviceMappers.sanitizeServices.calledOnce, true);
    assert.equal(res.status.calledWith(200), true);
    assert.equal(res.json.calledOnce, true);
    assert.equal(next.called, false);

    sandbox.restore();
  });

  test("getServiceProfile → success", async (t) => {
    const sandbox = sinon.createSandbox();

    sandbox.stub(hashIdUtil, "hashIdDecode").returns(1);
    sandbox.stub(serviceServices, "getServiceByIdPublic").resolves({
      id: 1,
      title: "service",
    });
    sandbox
      .stub(serviceMappers, "sanitizeServiceProfile")
      .resolves({ id: "encoded-1", title: "service" });

    const req = { params: { id: "encoded-1" } };
    const res = { status: sandbox.stub().returnsThis(), json: sandbox.stub() };
    const next = sandbox.stub();

    await serviceController.getServiceProfile(req, res, next);

    assert.equal(serviceServices.getServiceByIdPublic.calledOnceWith(1), true);
    assert.equal(res.status.calledWith(200), true);
    assert.equal(res.json.calledOnce, true);
    assert.equal(next.called, false);

    sandbox.restore();
  });

  test("alterServiceStatus → success", async (t) => {
    const sandbox = sinon.createSandbox();

    sandbox.stub(authUtils, "checkRoleAndPermission").resolves();
    sandbox.stub(hashIdUtil, "hashIdDecode").returns(1);
    sandbox.stub(serviceServices, "alterServiceStatus").resolves();

    const req = {
      auth: { id: 7 },
      body: { status: "approved", rejectionReason: undefined },
      params: { id: "encoded-1" },
    };
    const res = { sendStatus: sandbox.stub() };
    const next = sandbox.stub();

    await serviceController.alterServiceStatus(req, res, next);

    assert.equal(serviceServices.alterServiceStatus.calledOnce, true);
    assert.equal(res.sendStatus.calledWith(200), true);
    assert.equal(next.called, false);

    sandbox.restore();
  });

  test("alterServiceStatus → service error is forwarded to next", async (t) => {
    const sandbox = sinon.createSandbox();

    sandbox.stub(authUtils, "checkRoleAndPermission").resolves();
    sandbox.stub(hashIdUtil, "hashIdDecode").returns(1);
    sandbox
      .stub(serviceServices, "alterServiceStatus")
      .rejects(new AppError(422, "invalid status", true));

    const req = {
      auth: { id: 7 },
      body: { status: "wrong-status" },
      params: { id: "encoded-1" },
    };
    const res = { sendStatus: sandbox.stub() };
    const next = sandbox.stub();

    await serviceController.alterServiceStatus(req, res, next);

    assert.equal(next.calledOnce, true);
    assert.ok(next.firstCall.args[0] instanceof AppError);

    sandbox.restore();
  });

  test("pauseResumeService → success", async (t) => {
    const sandbox = sinon.createSandbox();

    sandbox.stub(authUtils, "checkRoleAndPermission").resolves();
    sandbox.stub(serviceServices, "pauseResumeService").resolves();

    const req = {
      auth: { id: 7 },
      body: { action: "pause" },
      params: { id: "encoded-1" },
    };
    const res = { sendStatus: sandbox.stub() };
    const next = sandbox.stub();

    await serviceController.pauseResumeService(req, res, next);

    assert.equal(
      serviceServices.pauseResumeService.calledOnceWith("encoded-1", "pause", req.auth),
      true
    );
    assert.equal(res.sendStatus.calledWith(200), true);
    assert.equal(next.called, false);

    sandbox.restore();
  });
});
