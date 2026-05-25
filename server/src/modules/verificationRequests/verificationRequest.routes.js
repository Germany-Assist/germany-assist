import express from "express";
import jwtUtils from "../../middlewares/jwt.middleware.js";
import verificationRequestController from "./verificationRequest.controller.js";
import multerUpload from "../../configs/multer.config.js";
const router = express.Router();

// Get all verification requests for the current user/provider (Dashboard)
router.get(
  "/all",
  jwtUtils.authenticateJwt,
  verificationRequestController.getAll,
);

// Unified upload endpoint for both Clients and Providers
router.post(
  "/upload",
  jwtUtils.authenticateJwt,
  multerUpload.fields([
    { name: "verificationImage", maxCount: 5 },
    { name: "verificationDocument", maxCount: 5 },
  ]),
  verificationRequestController.handleUpload,
);

// ================== Admin ==================

// List all verification requests (Admin Panel)
router.get(
  "/admin",
  jwtUtils.authenticateJwt,
  verificationRequestController.getAllAdmin,
);

// Approve, reject, or request changes (Admin Action)
router.put(
  "/admin/:id",
  jwtUtils.authenticateJwt,
  verificationRequestController.updateAdmin,
);

export default router;
