import { sequelize } from "../configs/database.js";
import { connectRedis } from "../configs/redis.js";
import { infoLogger } from "../utils/loggers.js";
import { DB_NAME } from "../configs/database.js";

export async function startup() {
  infoLogger("🚀 Starting application...");

  // DB
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });
  await import("../database/index.js");
  infoLogger(`✅ Database connected (${DB_NAME})`);

  // Redis
  await connectRedis();
  infoLogger("✅ Redis connected");
}
