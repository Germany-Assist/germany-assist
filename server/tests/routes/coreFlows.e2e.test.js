import { describe, it, beforeEach, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import sinon from "sinon";

import { app } from "../../src/app.js";
import { initDatabase } from "../../src/database/migrateAndSeed.js";
import db from "../../src/database/index.js";
import { sequelize } from "../../src/configs/database.js";
import hashIdUtil from "../../src/utils/hashId.util.js";
import bcryptUtil from "../../src/utils/bcrypt.util.js";
import jwtUtils from "../../src/middlewares/jwt.middleware.js";
import permissionServices from "../../src/modules/permission/permission.services.js";
import { roleTemplates } from "../../src/database/templates.js";
import stripeUtils from "../../src/utils/stripe.util.js";
import { backfillServiceImages } from "../../src/database/seeds/backfillServiceImages.js";

const PROVIDER_PASSWORD = "Provider@2026";
const CLIENT_PASSWORD = "Client@2026";
const ADMIN_PASSWORD = "Admin@2026";

function tokenFor(user, { role, relatedType = null, relatedId = null }) {
  return jwtUtils.generateAccessToken({
    id: user.id,
    UserRole: { role, relatedType, relatedId },
  });
}

async function createProvider({ email = "provider@e2e.test" } = {}) {
  const provider = await db.ServiceProvider.create({
    name: "E2E Provider",
    about: "A provider used by the end to end tests.",
    description: "A provider used by the end to end tests.",
    phoneNumber: "+4915112345678",
    email,
    type: "company",
    isVerified: true,
  });

  const user = await db.User.create(
    {
      firstName: "Erin",
      lastName: "Provider",
      email,
      password: bcryptUtil.hashPassword(PROVIDER_PASSWORD),
      isVerified: true,
      UserRole: {
        role: "service_provider_root",
        relatedType: "ServiceProvider",
        relatedId: provider.id,
      },
    },
    { include: [db.UserRole] },
  );

  await permissionServices.initPermissions(
    user.id,
    roleTemplates.service_provider_root,
  );

  return {
    provider,
    user,
    token: tokenFor(user, {
      role: "service_provider_root",
      relatedType: "ServiceProvider",
      relatedId: provider.id,
    }),
  };
}

async function createClient({ email = "client@e2e.test" } = {}) {
  const user = await db.User.create(
    {
      firstName: "Carla",
      lastName: "Client",
      email,
      password: bcryptUtil.hashPassword(CLIENT_PASSWORD),
      isVerified: true,
      UserRole: { role: "client", relatedType: "client", relatedId: null },
    },
    { include: [db.UserRole] },
  );
  return { user, token: tokenFor(user, { role: "client" }) };
}

async function createAdmin({ email = "admin@e2e.test" } = {}) {
  const user = await db.User.create(
    {
      firstName: "Ada",
      lastName: "Admin",
      email,
      password: bcryptUtil.hashPassword(ADMIN_PASSWORD),
      isVerified: true,
      UserRole: { role: "admin", relatedType: "admin", relatedId: null },
    },
    { include: [db.UserRole] },
  );
  await permissionServices.initPermissions(user.id, roleTemplates.admin);
  return { user, token: tokenFor(user, { role: "admin" }) };
}

async function firstSubcategory() {
  const subcategory = await db.Subcategory.findOne({
    order: [["id", "ASC"]],
  });
  assert.ok(subcategory, "seeded subcategories are required");
  return subcategory;
}

async function createServiceViaApi({ token, subcategory, overrides = {} }) {
  return await request(app)
    .post("/api/service/provider")
    .set("Authorization", `Bearer ${token}`)
    .send({
      title: "E2E Relocation Package",
      description: "A complete end to end relocation support package.",
      type: "oneTime",
      subcategoryId: hashIdUtil.hashIdEncode(subcategory.id),
      status: "review",
      variants: [
        { label: "Basic", price: 25, deliveryTime: 3 },
        { label: "Premium", price: 50, deliveryTime: 1 },
      ],
      ...overrides,
    });
}

beforeEach(async () => {
  await initDatabase(false);
});

after(async () => {
  await sequelize.close();
});

describe("E2E: auth", () => {
  it("logs in a verified user", async () => {
    const client = await createClient();
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: client.user.email, password: CLIENT_PASSWORD });

    assert.equal(res.status, 200);
    assert.ok(res.body.accessToken);
    assert.equal(res.body.user.email, client.user.email);
  });
});

describe("E2E: service provider creation (admin)", () => {
  it("creates a provider, exposes it by id and lets its root account log in", async () => {
    const admin = await createAdmin();
    const email = "new.provider@e2e.test";

    const createRes = await request(app)
      .post("/api/serviceProvider")
      .set("Authorization", `Bearer ${admin.token}`)
      .send({
        name: "New E2E Company",
        about: "Short tagline",
        description: "A newly created provider profile.",
        email,
        phone_number: "+4915112345678",
        password: PROVIDER_PASSWORD,
      });

    assert.equal(createRes.status, 201);
    assert.ok(createRes.body.serviceProvider.id);
    assert.equal(createRes.body.serviceProvider.name, "New E2E Company");

    const getRes = await request(app).get(
      `/api/serviceProvider/${createRes.body.serviceProvider.id}`,
    );
    assert.equal(getRes.status, 200);
    assert.equal(getRes.body.name, "New E2E Company");
    assert.ok(Array.isArray(getRes.body.services));

    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ email, password: PROVIDER_PASSWORD });
    assert.equal(loginRes.status, 200);
    assert.ok(loginRes.body.accessToken);
    assert.equal(loginRes.body.user.role, "service_provider_root");
  });
});

describe("E2E: create and publish a service", () => {
  it("creates a one-time service with variants linked to the service", async () => {
    const provider = await createProvider();
    const subcategory = await firstSubcategory();

    const res = await createServiceViaApi({
      token: provider.token,
      subcategory,
    });

    assert.equal(res.status, 201);
    const serviceId = hashIdUtil.hashIdDecode(res.body.data.id);
    assert.ok(serviceId);

    const service = await db.Service.findByPk(serviceId);
    assert.ok(service);
    assert.equal(service.serviceProviderId, provider.provider.id);
    assert.equal(service.status, "pending");

    const variants = await db.Variant.findAll({ where: { serviceId } });
    assert.equal(variants.length, 2);
    for (const variant of variants) {
      assert.equal(variant.serviceId, serviceId);
      assert.equal(Number.isInteger(variant.serviceId), true);
    }
  });

  it("creates a timeline service and links timelines to the service", async () => {
    const provider = await createProvider();
    const subcategory = await firstSubcategory();
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;

    const res = await request(app)
      .post("/api/service/provider")
      .set("Authorization", `Bearer ${provider.token}`)
      .send({
        title: "E2E German Course",
        description: "A timeline based German language course.",
        type: "timeline",
        subcategoryId: hashIdUtil.hashIdEncode(subcategory.id),
        status: "review",
        timelines: [
          {
            label: "Spring intake",
            price: 99,
            maxParticipants: 12,
            deadlineDate: new Date(now + day).toISOString(),
            startDate: new Date(now + 2 * day).toISOString(),
            endDate: new Date(now + 30 * day).toISOString(),
          },
        ],
      });

    assert.equal(res.status, 201);
    const serviceId = hashIdUtil.hashIdDecode(res.body.data.id);
    const timelines = await db.Timeline.findAll({ where: { serviceId } });
    assert.equal(timelines.length, 1);
    assert.equal(timelines[0].serviceId, serviceId);
    assert.equal(Number.isInteger(timelines[0].serviceId), true);
  });

  it("returns provider services instead of treating 'provider' as a service id", async () => {
    const provider = await createProvider();
    const subcategory = await firstSubcategory();
    await createServiceViaApi({ token: provider.token, subcategory });

    const res = await request(app)
      .get("/api/service/provider/services")
      .set("Authorization", `Bearer ${provider.token}`);

    assert.equal(res.status, 200);
    assert.equal(res.body.total, 1);
    assert.equal(res.body.data.length, 1);
    assert.equal(res.body.data[0].title, "E2E Relocation Package");
  });

  it("backfills a cover image for services without uploaded assets", async () => {
    const provider = await createProvider();
    const subcategory = await firstSubcategory();
    const created = await createServiceViaApi({
      token: provider.token,
      subcategory,
    });
    const serviceId = hashIdUtil.hashIdDecode(created.body.data.id);
    await db.Service.update(
      { status: "approved" },
      { where: { id: serviceId } },
    );

    const count = await backfillServiceImages();
    assert.ok(count >= 1);

    const list = await request(app).get("/api/service");
    const service = list.body.data.find((item) => item.title === "E2E Relocation Package");
    assert.match(service.image, /^https:\/\//);

    const profile = await request(app).get(`/api/service/${created.body.data.id}`);
    assert.equal(profile.status, 200);
    assert.equal(profile.body.assets.length, 1);
    assert.equal(profile.body.assets[0].url, service.image);
  });

  it("lets an admin approve it and serves the public profile", async () => {
    const provider = await createProvider();
    const admin = await createAdmin();
    const subcategory = await firstSubcategory();

    const created = await createServiceViaApi({
      token: provider.token,
      subcategory,
    });
    const serviceId = created.body.data.id;

    const approve = await request(app)
      .put(`/api/service/admin/services/status/${serviceId}`)
      .set("Authorization", `Bearer ${admin.token}`)
      .send({ status: "approved" });
    assert.equal(approve.status, 200);

    const adminList = await request(app)
      .get("/api/service/admin/services")
      .set("Authorization", `Bearer ${admin.token}`);
    assert.equal(adminList.status, 200);
    assert.equal(adminList.body.total, 1);

    const profile = await request(app).get(`/api/service/${serviceId}`);
    assert.equal(profile.status, 200);
    assert.equal(profile.body.title, "E2E Relocation Package");
    assert.equal(profile.body.variants.length, 2);

    const client = await createClient();
    const clientList = await request(app)
      .get("/api/service/client/services")
      .set("Authorization", `Bearer ${client.token}`);
    assert.equal(clientList.status, 200);
    assert.ok(Array.isArray(clientList.body));
  });
});

describe("E2E: buying a service", () => {
  async function approvedService(provider, subcategory, price = 25) {
    const created = await createServiceViaApi({
      token: provider.token,
      subcategory,
      overrides: {
        variants: [{ label: "Basic", price, deliveryTime: 3 }],
      },
    });
    const serviceId = hashIdUtil.hashIdDecode(created.body.data.id);
    await db.Service.update(
      { status: "approved" },
      { where: { id: serviceId } },
    );
    const variant = await db.Variant.findOne({ where: { serviceId } });
    return { serviceId, variant };
  }

  it("completes a free order end to end (persists the order)", async () => {
    const provider = await createProvider();
    const client = await createClient();
    const subcategory = await firstSubcategory();
    const { serviceId, variant } = await approvedService(
      provider,
      subcategory,
      25,
    );
    // make it a free service for the no-stripe path
    await variant.update({ price: 0 });

    const pay = await request(app)
      .get("/api/order/pay")
      .query({
        serviceId: hashIdUtil.hashIdEncode(serviceId),
        optionId: hashIdUtil.hashIdEncode(variant.id),
        type: "oneTime",
      })
      .set("Authorization", `Bearer ${client.token}`);

    assert.equal(pay.status, 200);
    assert.equal(pay.body.success, true);

    const order = await db.Order.findOne({ where: { serviceId } });
    assert.ok(order, "the free order must be committed");
    assert.equal(order.userId, client.user.id);
    assert.equal(order.status, "active");
    assert.equal(order.relatedType, "oneTime");

    const orders = await request(app)
      .get("/api/order/client/getAll")
      .set("Authorization", `Bearer ${client.token}`);
    assert.equal(orders.status, 200);
    assert.equal(orders.body.data.length, 1);

    const bought = await request(app)
      .get(
        `/api/order/client/checkIfBought/${hashIdUtil.hashIdEncode(serviceId)}`,
      )
      .set("Authorization", `Bearer ${client.token}`);
    assert.equal(bought.status, 200);
    assert.deepEqual(bought.body, [hashIdUtil.hashIdEncode(variant.id)]);

    const clientServices = await request(app)
      .get("/api/service/client/services")
      .set("Authorization", `Bearer ${client.token}`);
    assert.equal(clientServices.status, 200);
    assert.equal(clientServices.body.length, 1);
    assert.equal(clientServices.body[0].id, hashIdUtil.hashIdEncode(serviceId));
    assert.equal(clientServices.body[0].timelines.length, 1);
    assert.equal(
      clientServices.body[0].timelines[0].orderId,
      hashIdUtil.hashIdEncode(order.id),
    );
  });

  it("lets the provider list and close the order", async () => {
    const provider = await createProvider();
    const client = await createClient();
    const subcategory = await firstSubcategory();
    const { serviceId, variant } = await approvedService(
      provider,
      subcategory,
      25,
    );
    await variant.update({ price: 0 });

    const pay = await request(app)
      .get("/api/order/pay")
      .query({
        serviceId: hashIdUtil.hashIdEncode(serviceId),
        optionId: hashIdUtil.hashIdEncode(variant.id),
        type: "oneTime",
      })
      .set("Authorization", `Bearer ${client.token}`);
    assert.equal(pay.status, 200);

    const providerOrders = await request(app)
      .get("/api/order/serviceProvider/getAll")
      .set("Authorization", `Bearer ${provider.token}`);
    assert.equal(providerOrders.status, 200);
    assert.equal(providerOrders.body.data.length, 1);

    const order = await db.Order.findOne({ where: { serviceId } });
    const close = await request(app)
      .get(`/api/order/serviceProvider/close/${hashIdUtil.hashIdEncode(order.id)}`)
      .set("Authorization", `Bearer ${provider.token}`);
    assert.equal(close.status, 200);
    assert.equal(close.body.success, true);
    await order.reload();
    assert.equal(order.status, "pending_completion");

    const finance = await request(app)
      .get("/api/dashboard/provider/finance")
      .set("Authorization", `Bearer ${provider.token}`);
    assert.equal(finance.status, 200);
  });

  it("creates a Stripe payment intent for a paid service", async () => {
    const provider = await createProvider();
    const client = await createClient();
    const subcategory = await firstSubcategory();
    const { serviceId, variant } = await approvedService(
      provider,
      subcategory,
      50,
    );

    const stub = sinon
      .stub(stripeUtils, "createPaymentIntent")
      .resolves({ client_secret: "pi_secret_e2e" });

    try {
      const pay = await request(app)
        .get("/api/order/pay")
        .query({
          serviceId: hashIdUtil.hashIdEncode(serviceId),
          optionId: hashIdUtil.hashIdEncode(variant.id),
          type: "oneTime",
        })
        .set("Authorization", `Bearer ${client.token}`);

      assert.equal(pay.status, 200);
      assert.equal(pay.body.success, true);
      assert.equal(pay.body.message.clientSecret, "pi_secret_e2e");
      assert.equal(stub.calledOnce, true);
      assert.equal(stub.firstCall.args[0].amount, 50);
      assert.equal(
        stub.firstCall.args[0].metadata.relatedType,
        "oneTime",
      );
    } finally {
      stub.restore();
    }
  });

  it("opens a dispute through POST /api/dispute", async () => {
    const provider = await createProvider();
    const client = await createClient();
    const subcategory = await firstSubcategory();
    const { serviceId, variant } = await approvedService(
      provider,
      subcategory,
      25,
    );
    await variant.update({ price: 0 });

    const pay = await request(app)
      .get("/api/order/pay")
      .query({
        serviceId: hashIdUtil.hashIdEncode(serviceId),
        optionId: hashIdUtil.hashIdEncode(variant.id),
        type: "oneTime",
      })
      .set("Authorization", `Bearer ${client.token}`);
    assert.equal(pay.status, 200);

    const order = await db.Order.findOne({ where: { serviceId } });
    const dispute = await request(app)
      .post("/api/dispute")
      .set("Authorization", `Bearer ${client.token}`)
      .send({
        orderId: hashIdUtil.hashIdEncode(order.id),
        reason: "Service not delivered",
        description: "The provider did not deliver the agreed service.",
      });

    assert.equal(dispute.status, 201);
    assert.equal(dispute.body.success, true);

    const stored = await db.Dispute.findOne({ where: { orderId: order.id } });
    assert.ok(stored);
    assert.equal(stored.status, "open");
  });
});

describe("E2E: verification requests", () => {
  it("lets providers read their status and admins review requests", async () => {
    const provider = await createProvider();
    const admin = await createAdmin();

    const verification = await db.VerificationRequest.create({
      userId: provider.user.id,
      serviceProviderId: provider.provider.id,
      type: "identity",
      status: "pending",
    });

    const providerView = await request(app)
      .get("/api/requests/provider/profile")
      .set("Authorization", `Bearer ${provider.token}`);
    assert.equal(providerView.status, 200);
    assert.equal(providerView.body.data.length, 1);
    assert.equal(providerView.body.data[0].status, "pending");

    const adminView = await request(app)
      .get("/api/requests/admin")
      .set("Authorization", `Bearer ${admin.token}`);
    assert.equal(adminView.status, 200);
    assert.equal(adminView.body.data.length, 1);

    const update = await request(app)
      .put(`/api/requests/admin/${hashIdUtil.hashIdEncode(verification.id)}`)
      .set("Authorization", `Bearer ${admin.token}`)
      .send({ status: "approved", adminNote: "Verified by E2E" });
    assert.equal(update.status, 200);
    await verification.reload();
    assert.equal(verification.status, "approved");
  });
});

describe("E2E: admin dashboards", () => {
  it("serves the finance and services statistics used by the dashboard", async () => {
    const admin = await createAdmin();

    const finance = await request(app)
      .get("/api/dashboard/admin/finance")
      .set("Authorization", `Bearer ${admin.token}`);
    assert.equal(finance.status, 200);
    assert.equal(finance.body.success, true);
    assert.equal(typeof finance.body.data.grossTotal, "number");
    assert.equal(typeof finance.body.data.escrow, "number");

    const services = await request(app)
      .get("/api/dashboard/admin/services")
      .set("Authorization", `Bearer ${admin.token}`);
    assert.equal(services.status, 200);
    assert.equal(services.body.success, true);
    assert.equal(typeof services.body.data.totalServices, "number");
  });
});

describe("E2E: admin order routes", () => {
  it("lists and fetches orders for admins", async () => {
    const provider = await createProvider();
    const client = await createClient();
    const admin = await createAdmin();
    const subcategory = await firstSubcategory();

    const created = await createServiceViaApi({
      token: provider.token,
      subcategory,
      overrides: {
        variants: [{ label: "Basic", price: 1, deliveryTime: 3 }],
      },
    });
    const serviceId = hashIdUtil.hashIdDecode(created.body.data.id);
    await db.Service.update(
      { status: "approved" },
      { where: { id: serviceId } },
    );
    const variant = await db.Variant.findOne({ where: { serviceId } });
    await variant.update({ price: 0 });

    const pay = await request(app)
      .get("/api/order/pay")
      .query({
        serviceId: hashIdUtil.hashIdEncode(serviceId),
        optionId: hashIdUtil.hashIdEncode(variant.id),
        type: "oneTime",
      })
      .set("Authorization", `Bearer ${client.token}`);
    assert.equal(pay.status, 200);
    assert.equal(pay.body.success, true);

    const list = await request(app)
      .get("/api/order/admin")
      .set("Authorization", `Bearer ${admin.token}`);
    assert.equal(list.status, 200);
    assert.equal(list.body.meta.total, 1);
    assert.equal(list.body.data.length, 1);

    const order = await db.Order.findOne({ where: { serviceId } });
    const detail = await request(app)
      .get(`/api/order/admin/${hashIdUtil.hashIdEncode(order.id)}`)
      .set("Authorization", `Bearer ${admin.token}`);
    assert.equal(detail.status, 200);
    assert.equal(detail.body.id, order.id);
  });
});
