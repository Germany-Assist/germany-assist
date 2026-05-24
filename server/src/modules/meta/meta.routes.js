import { Router } from "express";
import metaController from "./meta.controllers.js";
const metaRouter = Router();

metaRouter.get("/", metaController.initCall);

metaRouter.get(
  "/register/categories",
  metaController.metaCategoriesForRegister,
);
metaRouter.get(
  "/requests/identity",
  metaController.getAvailableIdentityRequests,
);

export default metaRouter;
