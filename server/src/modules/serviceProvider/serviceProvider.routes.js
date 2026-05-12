import express from "express";
import serviceProviderController from "./serviceProvider.controller.js";
import jwt from "../../middlewares/jwt.middleware.js";
import { validateExpress } from "../../middlewares/expressValidator.js";
import {
  updateServiceProviderValidator,
  createFreelancerValidator,
  createCompanyValidator,
} from "./serviceProvider.validators.js";
import { idUUIDparamValidator } from "../../validators/general.validators.js";
import multerUpload from "../../configs/multer.config.js";
const serviceProviderRouter = express.Router();

serviceProviderRouter.get("/", serviceProviderController.getAllServiceProvider);

serviceProviderRouter.post(
  "/freelancer/signup",
  multerUpload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "idDocument", maxCount: 1 },
    { name: "proofOfResidence", maxCount: 1 },
    { name: "businessRegistration", maxCount: 1 },
    { name: "categoryFiles", maxCount: 24 },
  ]),
  createFreelancerValidator,
  validateExpress,
  // categoryEntries is sent as text field alongside categoryFiles
  serviceProviderController.signupFreelancer,
);

serviceProviderRouter.post(
  "/company/signup",
  multerUpload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "idDocument", maxCount: 1 },
    { name: "proofOfResidence", maxCount: 1 },
    { name: "businessRegistration", maxCount: 1 },
    { name: "categoryFiles", maxCount: 24 },
  ]),
  createCompanyValidator,
  validateExpress,
  // categoryEntries is sent as text field alongside categoryFiles
  serviceProviderController.signupCompany,
);

serviceProviderRouter.get(
  "/:id",
  idUUIDparamValidator,
  validateExpress,
  serviceProviderController.getServiceProviderById,
);
serviceProviderRouter.delete(
  "/:id",
  idUUIDparamValidator,
  validateExpress,
  jwt.authenticateJwt,
  serviceProviderController.deleteServiceProvider,
);
serviceProviderRouter.put(
  "/",
  updateServiceProviderValidator,
  validateExpress,
  jwt.authenticateJwt,
  serviceProviderController.updateServiceProvider,
);

serviceProviderRouter.get(
  "/restore/:id",
  idUUIDparamValidator,
  validateExpress,
  jwt.authenticateJwt,
  serviceProviderController.restoreServiceProvider,
);

export default serviceProviderRouter;
