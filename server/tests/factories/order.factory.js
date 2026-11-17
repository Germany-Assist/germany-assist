import { v4 as uuid } from "uuid";
import db from "../../src/database/index.js";
import { errorLogger } from "../../src/utils/loggers.js";

export async function orderFactory(overrides = {}) {
  try {
    if (
      !overrides.userId ||
      !overrides.timelineId ||
      !overrides.serviceId ||
      !overrides.serviceProviderId
    )
      throw new Error(
        "order factory failed missing user id or timeline id or serviceId or serviceProviderId"
      );
    const data = {
      amount: 12345,
      status: "active",
      stripePaymentIntentId: uuid(),
      currency: "usd",
      relatedId: overrides.timelineId,
      relatedType: "timeline",
      ...overrides,
    };
    return await db.Order.create(data);
  } catch (error) {
    errorLogger(error.message);
  }
}
