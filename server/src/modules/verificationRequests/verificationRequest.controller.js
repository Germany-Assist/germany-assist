import { sequelize } from "../../configs/database.js";
import authUtil from "../../utils/authorize.util.js";
import { AppError } from "../../utils/error.class.js";
import hashIdUtil from "../../utils/hashId.util.js";
import verificationRequestService from "./verificationRequest.services.js";

/**
 * Handle document uploads for verification (Identity, Category, Badge).
 * Used by both Clients (Identity only) and Providers (All types).
 */
async function handleUpload(req, res, next) {
  const t = await sequelize.transaction();
  try {
    // 1. Basic permission check (must be logged in)
    await authUtil.checkRoleAndPermission(req.auth, [
      "client",
      "service_provider_root",
      "service_provider_rep",
    ]);

    // 2. Validate input
    const { type, relatedId } = req.body;
    if (!type || !relatedId) {
      throw new AppError(422, "Type and relatedId are required", true);
    }

    if (!req.files || Object.values(req.files).length < 1) {
      throw new AppError(422, "No files uploaded", true);
    }

    // 3. Delegate to service
    await verificationRequestService.handleUserRequest({
      auth: req.auth,
      files: req.files,
      body: req.body,
      t,
    });

    await t.commit();
    res.status(200).json({ success: true, message: "Verification request submitted successfully" });
  } catch (error) {
    await t.rollback();
    next(error);
  }
}

/**
 * Get all verification requests for the current user/provider.
 * Used by the frontend Verification Centre.
 */
async function getAll(req, res, next) {
  try {
    const results = await verificationRequestService.getAll(req.auth);
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
}

// ================== Admin ==================

async function getAllAdmin(req, res, next) {
  try {
    await authUtil.checkRoleAndPermission(req.auth, ["admin", "super_admin"]);
    const { data, meta } = await verificationRequestService.getAllAdmin(req.query);
    res.status(200).json({ success: true, data, meta });
  } catch (error) {
    next(error);
  }
}

async function updateAdmin(req, res, next) {
  const t = await sequelize.transaction();
  try {
    await authUtil.checkRoleAndPermission(req.auth, ["admin", "super_admin"]);
    const requestId = hashIdUtil.hashIdDecode(req.params.id);
    await verificationRequestService.updateAdmin(requestId, req.body, t);
    await t.commit();
    res.status(200).json({ success: true, message: "Request updated successfully" });
  } catch (error) {
    await t.rollback();
    next(error);
  }
}

const verificationRequestController = {
  handleUpload,
  getAll,
  getAllAdmin,
  updateAdmin,
};

export default verificationRequestController;
