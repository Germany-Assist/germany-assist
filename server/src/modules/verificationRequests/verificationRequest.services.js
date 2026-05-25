import AssetService from "../../services/assts.services.js";
import { AppError } from "../../utils/error.class.js";
import hashIdUtil from "../../utils/hashId.util.js";
import verificationRequestMappers from "./verificationRequest.mapper.js";
import verificationRequestRepository from "./verificationRequest.repository.js";

/**
 * Unified handler for creating or updating verification requests.
 * Handles role-based restrictions and status transitions.
 */
async function handleUserRequest({ auth, files, body, t }) {
  const { type, relatedId } = body;
  const decodedRelatedId = hashIdUtil.hashIdDecode(relatedId);

  // 1. Role-Based Permissions
  // Clients can only apply for identity verification
  if (auth.role === "client" && type !== "identity") {
    throw new AppError(
      403,
      "Clients can only request identity verification",
      true,
      "Clients can only request identity verification",
    );
  }

  const userId = auth.id;
  const serviceProviderId = auth.relatedId || null;

  // 2. Check for existing request
  const filters = {
    userId,
    type,
    relatedId: decodedRelatedId,
  };
  if (serviceProviderId) filters.serviceProviderId = serviceProviderId;

  let request =
    await verificationRequestRepository.findExistingRequest(filters);

  if (request) {
    // 3. Status Transition Logic
    // If it's already pending, we don't allow re-upload to prevent review spamming
    if (request.status === "pending") {
      throw new AppError(
        400,
        "You already have a pending request for this verification type",
        true,
        "You already have a request for verification",
      );
    }

    // If it's approved (Verified) or rejected, we move it back to pending for re-evaluation
    if (["approved", "rejected", "adminRequest"].includes(request.status)) {
      await verificationRequestRepository.updateAdmin(
        request.id,
        { status: "pending", adminNote: null },
        t,
      );
    }
  } else {
    // 4. Create new request
    request = await verificationRequestRepository.createRequest(
      {
        userId,
        serviceProviderId,
        type,
        relatedId: decodedRelatedId,
        status: "pending",
      },
      t,
    );
  }

  // 5. Upload Assets
  if (files && files.length > 0) {
    await Promise.all(
      files.map((file) => {
        // Automatically determine typeKey based on mimetype
        const typeKey = file.mimetype.startsWith("image/")
          ? "verificationImage"
          : "verificationDocument";

        return AssetService.uploadAsset({
          files: [file],
          ownerId: request.id,
          typeKey,
          userId: userId,
          label: file.originalname,
          transaction: t,
        });
      }),
    );
  }

  return { success: true };
}

async function getAllProvider(providerId) {
  const requests =
    await verificationRequestRepository.getAllProvider(providerId);
  return await verificationRequestMappers.multiRequestMapper(requests);
}

// ================== Admin ==================

async function getAllAdmin(query) {
  const filters = {};
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const offset = (page - 1) * limit;

  if (query.type) filters.type = query.type;
  if (query.status) filters.status = query.status;

  const total = await verificationRequestRepository.countRequests(filters);
  const rows = await verificationRequestRepository.getAllAdmin({
    limit,
    offset,
    filters,
  });

  const data = await verificationRequestMappers.multiRequestMapper(rows);
  return {
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    data,
  };
}

async function updateAdmin(requestId, updates, t) {
  const { adminNote, status, expDate } = updates;
  const update = await verificationRequestRepository.updateAdmin(
    requestId,
    { adminNote, status, expDate },
    t,
  );
  if (!update) throw new AppError(404, "failed to update request", true);
  return update;
}

async function getAll(auth) {
  const filters = {};
  if (auth.relatedId) {
    filters.serviceProviderId = auth.relatedId;
  } else {
    filters.userId = auth.id;
  }
  const requests = await verificationRequestRepository.getAll(filters);
  return await verificationRequestMappers.multiRequestMapper(requests);
}

const verificationRequestService = {
  handleUserRequest,
  getAllProvider,
  getAllAdmin,
  updateAdmin,
  getAll,
};

export default verificationRequestService;
