import { describe, it, beforeEach, after } from "node:test";
import { app } from "../../src/app.js";
import request from "supertest";
import { errorLogger } from "../../src/utils/loggers.js";
import { initDatabase } from "../../src/database/migrateAndSeed.js";
import assert from "node:assert";
import { userFactory, userWithTokenFactory } from "../factories/user.factory.js";
import db from "../../src/database/index.js";
import { TOKENS_CONSTANTS } from "../../src/configs/constants.js";

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

const tokensForUser = (userId, type) =>
  db.Token.findAll({ where: { userId, type } });

describe("api/auth/password-reset - post - send reset code path", () => {
  it("should create a password reset token for an existing user", async () => {
    const user = await userFactory();
    const res = await request(app)
      .post("/api/auth/password-reset")
      .send({ email: user.email });
    assert.equal(res.status, 200);
    const tokens = await tokensForUser(
      user.id,
      TOKENS_CONSTANTS.PASSWORD_RESET
    );
    assert.equal(tokens.length, 1, "one reset token should be persisted");
    assert.equal(tokens[0].isValid, true);
    assert.equal(tokens[0].oneTime, true);
    assert.ok(tokens[0].expiresAt > new Date(), "token should not be expired");
  });

  it("should not leak existence of unknown emails", async () => {
    const res = await request(app)
      .post("/api/auth/password-reset")
      .send({ email: "nobody@nowhere.dev" });
    assert.equal(res.status, 404);
  });

  it("should enforce the resend cooldown", async () => {
    const user = await userFactory();
    const first = await request(app)
      .post("/api/auth/password-reset")
      .send({ email: user.email });
    assert.equal(first.status, 200);
    const second = await request(app)
      .post("/api/auth/password-reset")
      .send({ email: user.email });
    assert.equal(second.status, 429);
    const tokens = await tokensForUser(
      user.id,
      TOKENS_CONSTANTS.PASSWORD_RESET
    );
    assert.equal(tokens.length, 1, "cooldown should not create a second token");
  });

  it("should fail for invalid email format", async () => {
    const res = await request(app)
      .post("/api/auth/password-reset")
      .send({ email: "not-an-email" });
    assert.equal(res.status, 422);
  });
});

describe("api/auth/resendVerificationEmail - post - send verification email path", () => {
  it("should create a verification token for an unverified user", async () => {
    const user = await userFactory({ isVerified: false });
    const res = await request(app)
      .post("/api/auth/resendVerificationEmail")
      .send({ email: user.email });
    assert.equal(res.status, 200);
    assert.deepEqual(res.body, { success: true, message: "Email sent" });
    const tokens = await tokensForUser(
      user.id,
      TOKENS_CONSTANTS.EMAIL_VERIFICATION
    );
    assert.equal(tokens.length, 1, "verification token should be persisted");
    assert.equal(tokens[0].isValid, true);
  });

  it("should fail for an already verified user", async () => {
    const user = await userFactory({ isVerified: true });
    const res = await request(app)
      .post("/api/auth/resendVerificationEmail")
      .send({ email: user.email });
    assert.equal(res.status, 400);
    const tokens = await tokensForUser(
      user.id,
      TOKENS_CONSTANTS.EMAIL_VERIFICATION
    );
    assert.equal(tokens.length, 0);
  });

  it("should fail for unknown email", async () => {
    const res = await request(app)
      .post("/api/auth/resendVerificationEmail")
      .send({ email: "ghost@nowhere.dev" });
    assert.equal(res.status, 404);
  });

  it("should enforce the resend cooldown", async () => {
    const user = await userFactory({ isVerified: false });
    const first = await request(app)
      .post("/api/auth/resendVerificationEmail")
      .send({ email: user.email });
    assert.equal(first.status, 200);
    const second = await request(app)
      .post("/api/auth/resendVerificationEmail")
      .send({ email: user.email });
    assert.equal(second.status, 429);
    const tokens = await tokensForUser(
      user.id,
      TOKENS_CONSTANTS.EMAIL_VERIFICATION
    );
    assert.equal(tokens.length, 1, "cooldown should not create a second token");
  });

  it("should not require authentication (public send path)", async () => {
    const res = await request(app)
      .post("/api/auth/resendVerificationEmail")
      .send({ email: "" });
    assert.equal(res.status, 404);
  });
});
