import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { v4 as uuidv4 } from "uuid";
import apiRouter from "./routes/index.routes.js";
import paymentsRouter from "./modules/payment/payments.routes.js";
import morganMiddleware from "./middlewares/morgan.middleware.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { AppError } from "./utils/error.class.js";
import { FRONTEND_URL, NODE_ENV } from "./configs/serverConfig.js";
import setupSwagger from "./docs/swagger.js";
import path from "node:path";

const isProd = NODE_ENV === "production";
export const app = express();

app.use((req, res, next) => {
  req.requestId = uuidv4();
  next();
});

app.use(express.json());
app.use(cookieParser());

app.use(
  helmet({
    // 1. Disable HSTS (This forces HTTPS at the browser level)
    strictTransportSecurity: false,

    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: {
      directives: {
        // 2. Disable the auto-upgrade to HTTPS
        "upgrade-insecure-requests": null,

        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          "https://js.stripe.com",
          "https://accounts.google.com",
          "https://apis.google.com",
        ],
        frameSrc: [
          "'self'",
          "https://js.stripe.com",
          "https://hooks.stripe.com",
          "https://accounts.google.com",
        ],
        connectSrc: [
          "'self'",
          "https://api.stripe.com",
          "https://accounts.google.com",
          "https://restcountries.com",
        ],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  }),
);

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  }),
);

app.set("trust proxy", 1);
app.use(morganMiddleware);

app.use("/api", apiRouter);
app.use("/payments", paymentsRouter);

if (!isProd) {
  await setupSwagger(app);
}

// if (isProd) {
const clientPath = path.join(process.cwd(), "public");

app.use(express.static(clientPath));

// SPA fallback
app.get(/.*/, (req, res) => {
  if (req.path.startsWith("/api")) return res.status(404).end();
  res.sendFile(path.join(clientPath, "index.html"));
});
// }

app.get("/health", (_, res) => res.sendStatus(200));

app.use((req, res, next) => {
  next(new AppError(404, "bad route", true));
});

app.use(errorMiddleware);

export default app;
