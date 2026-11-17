import test, { describe } from "node:test";
import assert from "node:assert/strict";
import sinon from "sinon";

import commentController from "../../src/modules/comment/comment.controller.js";
import commentServices from "../../src/modules/comment/comment.services.js";
import { AppError } from "../../src/utils/error.class.js";
import { sequelize } from "../../src/configs/database.js";
describe("testing comment controller", () => {
  test("should create a new comment successfully", async (t) => {
    const req = {
      body: { commentBody: "Nice post!", postId: "abc123", commentId: null },
      auth: { id: 1 },
    };
    const res = { send: sinon.stub(), status: sinon.stub().returnsThis() };
    const next = sinon.stub();

    // Transaction mock
    const tMock = { commit: sinon.stub(), rollback: sinon.stub() };
    sinon.stub(sequelize, "transaction").resolves(tMock);

    // Service stubs
    sinon.stub(commentServices, "createNewComment").resolves({ id: 55 });

    await commentController.createNewComment(req, res, next);

    assert.ok(commentServices.createNewComment.calledOnce);
    assert.ok(res.status.calledOnceWith(201));
    assert.ok(res.send.calledOnce);
    assert.ok(tMock.commit.calledOnce);
    assert.ok(tMock.rollback.notCalled);
    assert.ok(next.notCalled);

    sinon.restore();
  });

  test("should throw AppError when user cannot comment", async (t) => {
    const req = {
      body: { commentBody: "test", postId: "xyz", commentId: null },
      auth: { id: 2 },
    };
    const res = { send: sinon.stub() };
    const next = sinon.stub();

    const tMock = { commit: sinon.stub(), rollback: sinon.stub() };
    sinon.stub(sequelize, "transaction").resolves(tMock);
    sinon
      .stub(commentServices, "createNewComment")
      .rejects(new AppError(403, "permission denied", true, "permission denied"));

    await commentController.createNewComment(req, res, next);

    assert.ok(tMock.rollback.calledOnce);
    assert.ok(next.calledOnce);
    const errorArg = next.firstCall.args[0];
    assert.ok(errorArg instanceof AppError);
    assert.equal(errorArg.httpCode, 403);

    sinon.restore();
  });

  test("should rollback transaction and call next on unexpected error", async (t) => {
    const req = {
      body: { commentBody: "bad data", postId: "111", commentId: null },
      auth: { id: 3 },
    };
    const res = { send: sinon.stub() };
    const next = sinon.stub();

    const tMock = { commit: sinon.stub(), rollback: sinon.stub() };
    sinon.stub(sequelize, "transaction").resolves(tMock);
    sinon
      .stub(commentServices, "createNewComment")
      .rejects(new Error("DB crash"));

    await commentController.createNewComment(req, res, next);

    assert.ok(tMock.rollback.calledOnce);
    assert.ok(next.calledOnce);
    assert.match(next.firstCall.args[0].message, /DB crash/);

    sinon.restore();
  });
});
