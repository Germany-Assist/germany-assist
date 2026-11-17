import { sequelize } from "../../configs/database.js";
import db from "../index.js";
import bcryptUtil from "../../utils/bcrypt.util.js";
import { v4 as uuidv4 } from "uuid";

/**
 * Deterministic development accounts and the data linked to them.
 * Runs after the random test data seed so every dashboard has content.
 *
 * Accounts (all verified, safe to log in with):
 *   druid@germanyassist.dev    / Druid@2026    -> super_admin (your account)
 *   admin@germanyassist.dev    / Admin@2026    -> admin
 *   client@germanyassist.dev   / Client@2026   -> client (has orders, favorites, reviews, disputes)
 *   provider@germanyassist.dev / Provider@2026 -> service_provider_root (owns a provider with services)
 *   employer@germanyassist.dev / Employer@2026 -> employer_root (owns an employer)
 */

const ACCOUNTS = {
  druid: {
    email: "druid@germanyassist.dev",
    password: "Druid@2026",
    firstName: "Druid",
    lastName: "Dev",
    role: "super_admin",
  },
  admin: {
    email: "admin@germanyassist.dev",
    password: "Admin@2026",
    firstName: "Anna",
    lastName: "Admin",
    role: "admin",
  },
  client: {
    email: "client@germanyassist.dev",
    password: "Client@2026",
    firstName: "Max",
    lastName: "Mustermann",
    role: "client",
  },
  provider: {
    email: "provider@germanyassist.dev",
    password: "Provider@2026",
    firstName: "Lena",
    lastName: "Schneider",
    role: "service_provider_root",
  },
  employer: {
    email: "employer@germanyassist.dev",
    password: "Employer@2026",
    firstName: "Stefan",
    lastName: "Wagner",
    role: "employer_root",
  },
};

async function upsertUser({ email, password, firstName, lastName, dob }) {
  let user = await db.User.findOne({ where: { email } });
  if (!user) {
    user = await db.User.create({
      email,
      password: bcryptUtil.hashPassword(password),
      firstName,
      lastName,
      dob,
      isVerified: true,
      isRoot: false,
    });
  }
  return user;
}

export default async function seedDevAccounts() {
  console.log("👤 Seeding deterministic dev accounts...");

  const accounts = {};
  for (const [key, account] of Object.entries(ACCOUNTS)) {
    accounts[key] = await upsertUser({
      ...account,
      dob: new Date(1990, 0, 1),
    });
  }

  // Business entities owned by the demo accounts (resolved unconditionally so
  // re-running the seed after a partial failure still works)
  const [provider] = await db.ServiceProvider.findOrCreate({
    where: { email: "hello@berlin-relocation.dev" },
    defaults: {
      name: "Berlin Relocation Experts",
      type: "company",
      about:
        "Boutique relocation agency helping newcomers settle in Berlin. Visa, housing, registration and language support. End-to-end relocation services for expats moving to Germany: visa applications, apartment hunting, city registration (Anmeldung), bank accounts and integration coaching.",
      email: "hello@berlin-relocation.dev",
      phoneNumber: "+493012345678",
      image: "https://picsum.photos/seed/berlin-relocation/400/400",
      isVerified: true,
      rating: 4.8,
      totalReviews: 27,
    },
  });
  const [employer] = await db.Employer.findOrCreate({
    where: { email: "jobs@munichtech.dev" },
    defaults: {
      name: "MunichTech GmbH",
      about:
        "Software company hiring international engineers and supporting relocation to Munich.",
      description:
        "MunichTech hires engineers from all over the world and offers visa sponsorship, relocation support and German courses.",
      email: "jobs@munichtech.dev",
      phoneNumber: "+498912345678",
      image: "https://picsum.photos/seed/munichtech/400/400",
      isVerified: true,
      views: 87,
      rating: 4.6,
      totalReviews: 12,
    },
  });
  accounts.provider.serviceProvider = provider;
  accounts.employer.employer = employer;

  // Roles (skip when already assigned, e.g. re-running the seed)
  for (const [key, account] of Object.entries(ACCOUNTS)) {
    const user = accounts[key];
    const existingRole = await db.UserRole.findOne({
      where: { userId: user.id, role: account.role },
    });
    if (existingRole) continue;

    let relatedId = null;
    let relatedType = null;

    if (account.role === "service_provider_root") {
      relatedId = provider.id;
      relatedType = "ServiceProvider";
    }

    await db.UserRole.create({
      userId: user.id,
      role: account.role,
      relatedId,
      relatedType,
    });
  }

  const client = accounts.client;
  const providerUser = accounts.provider;

  // User profiles
  await db.UserProfile.findOrCreate({
    where: { userId: client.id },
    defaults: {
      userId: client.id,
      nationality: "Egypt",
      countryOfResidence: "Germany",
      phoneNumber: "+4915112345678",
    },
  });
  await db.UserProfile.findOrCreate({
    where: { userId: accounts.druid.id },
    defaults: {
      userId: accounts.druid.id,
      nationality: "Germany",
      countryOfResidence: "Germany",
      phoneNumber: "+4915198765432",
    },
  });

  // Services owned by the provider account (approved + published so the client can order them)
  const subcategories = await db.Subcategory.findAll({ order: [["id", "ASC"]], limit: 6 });
  const serviceDefs = [
    {
      title: "Visa Application Assistance",
      description:
        "Full support preparing and submitting your German visa application, including document checklists and embassy appointment booking.",
      price: 249.0,
      type: "oneTime",
    },
    {
      title: "Apartment Finding Service",
      description:
        "We shortlist flats, accompany you to viewings and review your rental contract before you sign.",
      price: 399.0,
      type: "oneTime",
    },
    {
      title: "City Registration (Anmeldung)",
      description:
        "Guided Anmeldung appointment: documents, translation and a person who joins you at the Bürgeramt.",
      price: 89.0,
      type: "oneTime",
    },
    {
      title: "German Language Coaching (Monthly)",
      description:
        "Four 60-minute 1:1 sessions per month with a certified tutor, tailored to your level.",
      price: 159.0,
      type: "timeline",
    },
    {
      title: "Bank Account Setup Help",
      description:
        "Step-by-step help opening a German bank account, including document preparation.",
      price: 49.0,
      type: "oneTime",
    },
    {
      title: "Relocation All-in-One Package",
      description:
        "Visa, housing, registration, insurance and utilities handled as one coordinated package.",
      price: 899.0,
      type: "oneTime",
    },
  ];

  const createdServices = [];
  for (const [i, def] of serviceDefs.entries()) {
    const { price, ...serviceFields } = def;
    const [service] = await db.Service.findOrCreate({
      where: { title: def.title, userId: providerUser.id },
      defaults: {
        ...serviceFields,
        userId: providerUser.id,
        serviceProviderId: provider.id,
        subcategoryId:
          subcategories[i % subcategories.length]?.id ?? subcategories[0].id,
        views: 40 + i * 9,
        rating: 4.5,
        totalReviews: 3,
        status: "approved",
        deliveryMode: "online",
      },
    });

    const [timeline] = await db.Timeline.findOrCreate({
      where: { serviceId: service.id },
      defaults: {
        serviceId: service.id,
        isArchived: false,
        label: `Timeline ${service.id}`,
        price: def.price,
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        deadlineDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      },
    });

    // Variants (pricing tiers) for each service
    const variantCount = await db.Variant.count({ where: { serviceId: service.id } });
    if (variantCount === 0) {
      await db.Variant.bulkCreate([
        {
          serviceId: service.id,
          isArchived: false,
          price: def.price,
          deliveryTime: 3,
          label: "Basic",
        },
        {
          serviceId: service.id,
          isArchived: false,
          price: Math.round(def.price * 1.5 * 100) / 100,
          deliveryTime: 2,
          label: "Standard",
        },
        {
          serviceId: service.id,
          isArchived: false,
          price: Math.round(def.price * 2 * 100) / 100,
          deliveryTime: 1,
          label: "Premium",
        },
      ]);
    }

    createdServices.push({ service, timeline });
  }

  // Client orders on the provider's services
  const orderDefs = [
    { status: "completed", amount: 249.0 },
    { status: "active", amount: 159.0 },
    { status: "pending_completion", amount: 89.0 },
  ];
  const createdOrders = [];
  for (const [i, def] of orderDefs.entries()) {
    const { service, timeline } = createdServices[i];
    const [order] = await db.Order.findOrCreate({
      where: {
        userId: client.id,
        serviceId: service.id,
        status: def.status,
      },
      defaults: {
        userId: client.id,
        serviceId: service.id,
        serviceProviderId: service.serviceProviderId,
        relatedId: timeline.id,
        relatedType: "timeline",
        amount: def.amount,
        currency: "usd",
        status: def.status,
        stripePaymentIntentId: `pi_dev_${uuidv4().replace(/-/g, "")}`,
      },
    });
    createdOrders.push(order);
  }

  // Client favorites and a review on the completed service
  await db.Favorite.findOrCreate({
    where: { userId: client.id, serviceId: createdServices[0].service.id },
    defaults: { userId: client.id, serviceId: createdServices[0].service.id },
  });
  await db.Favorite.findOrCreate({
    where: { userId: client.id, serviceId: createdServices[5].service.id },
    defaults: { userId: client.id, serviceId: createdServices[5].service.id },
  });
  await db.Review.findOrCreate({
    where: { userId: client.id, serviceId: createdServices[0].service.id },
    defaults: {
      userId: client.id,
      serviceId: createdServices[0].service.id,
      rating: 5,
      body: "They handled my visa application end to end. Absolutely recommended.",
    },
  });

  // A dispute on the pending order (open) so the dispute flows have data
  await db.Dispute.findOrCreate({
    where: { orderId: createdOrders[2].id },
    defaults: {
      userId: client.id,
      serviceProviderId: provider.id,
      orderId: createdOrders[2].id,
      reason: "Service not delivered on time",
      description: "The appointment support was booked for last week but nobody showed up.",
      status: "open",
    },
  });

  // Payouts for the provider on the completed/active orders
  await db.Payout.findOrCreate({
    where: { orderId: createdOrders[0].id },
    defaults: {
      orderId: createdOrders[0].id,
      serviceProviderId: provider.id,
      amount: 249.0,
      amountToPay: 224.1,
      currency: "usd",
      status: "paid",
    },
  });
  await db.Payout.findOrCreate({
    where: { orderId: createdOrders[1].id },
    defaults: {
      orderId: createdOrders[1].id,
      serviceProviderId: provider.id,
      amount: 159.0,
      amountToPay: 143.1,
      currency: "usd",
      status: "processing",
    },
  });

  // Verification requests (identity / category / badge) for the admin dashboard
  const verificationDefs = [
    {
      userId: providerUser.id,
      serviceProviderId: provider.id,
      type: "identity",
      status: "pending",
      adminNote: null,
    },
    {
      userId: providerUser.id,
      serviceProviderId: provider.id,
      type: "category",
      status: "approved",
      adminNote: "Coaching credentials verified.",
    },
    {
      userId: client.id,
      serviceProviderId: null,
      type: "identity",
      status: "adminRequest",
      adminNote: "Please verify this account manually (dev seed).",
    },
  ];
  for (const def of verificationDefs) {
    const existing = await db.VerificationRequest.findOne({ where: def });
    if (!existing) await db.VerificationRequest.create(def);
  }

  // Client subscribes to the provider's timeline
  const firstTimeline = createdServices[0].timeline;
  await db.Subscriber.findOrCreate({
    where: {
      userId: client.id,
      relatedId: firstTimeline.id,
      relatedType: "timeline",
    },
    defaults: {
      userId: client.id,
      relatedId: firstTimeline.id,
      relatedType: "timeline",
    },
  });

  // A chat between the client and the provider
  const existingChat = await db.Chat.findOne({
    where: {
      [sequelize.Sequelize.Op.and]: [
        sequelize.where(
          sequelize.literal(`"participants"->>'${client.id}'`),
          sequelize.literal(`'client'`),
        ),
        sequelize.where(
          sequelize.literal(`"participants"->>'${providerUser.id}'`),
          sequelize.literal(`'provider'`),
        ),
      ],
    },
  });
  if (!existingChat) {
    await db.Chat.create({
      participants: {
        [String(client.id)]: "client",
        [String(providerUser.id)]: "provider",
      },
      conversation: [
        {
          from: client.id,
          body: "Hi! Is the visa assistance still available for next month?",
          sentAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          from: providerUser.id,
          body: "Hello Max, yes it is. I will send you the document checklist today.",
          sentAt: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
        },
      ],
    });
  }

  // A demo coupon (coupon codes must be UUIDv4 in the database)
  const demoCouponCode = "00000000-0000-4000-8000-000000000010";
  await db.Coupon.findOrCreate({
    where: { couponCode: demoCouponCode },
    defaults: {
      couponCode: demoCouponCode,
      discount_rate: 10.0,
      expDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
    },
  });

  // Notifications for the demo accounts
  const notificationDefs = [
    {
      userId: client.id,
      message: "Your order for Visa Application Assistance is completed.",
      type: "info",
      isRead: false,
      url: `/orders`,
      metadata: { source: "dev_seed" },
    },
    {
      userId: client.id,
      message: "New message from Berlin Relocation Experts.",
      type: "alert",
      isRead: false,
      url: `/messages`,
      metadata: { source: "dev_seed" },
    },
    {
      userId: providerUser.id,
      serviceProviderId: provider.id,
      message: "New order received for German Language Coaching (Monthly).",
      type: "info",
      isRead: false,
      url: `/orders`,
      metadata: { source: "dev_seed" },
    },
    {
      userId: providerUser.id,
      serviceProviderId: provider.id,
      message: "Your identity verification request is pending review.",
      type: "warning",
      isRead: true,
      url: `/verification`,
      metadata: { source: "dev_seed" },
    },
    {
      userId: accounts.admin.id,
      message: "3 verification requests are waiting for review.",
      type: "alert",
      isRead: false,
      url: `/dashboard/verification-requests`,
      metadata: { source: "dev_seed" },
    },
  ];
  for (const def of notificationDefs) {
    const existing = await db.Notification.findOne({ where: def });
    if (!existing) await db.Notification.create(def);
  }

  console.log("✅ Dev accounts ready:");
  for (const [key, account] of Object.entries(ACCOUNTS)) {
    console.log(`   ${account.email} / ${account.password} (${account.role})`);
  }
}
