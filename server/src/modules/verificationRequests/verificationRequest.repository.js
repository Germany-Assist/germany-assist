import db from "../../database/index.js";

async function createRequest(data, t) {
  return db.VerificationRequest.create(data, { transaction: t });
}

async function findExistingRequest(filters) {
  return db.VerificationRequest.findOne({
    where: filters,
  });
}

async function getAllProvider(serviceProviderId, filters = {}) {
  return db.VerificationRequest.findAll({
    where: { ...filters, serviceProviderId },
    include: [
      {
        model: db.Asset,
        as: "assets",
        through: { attributes: [] },
        attributes: ["url", "label", "mediaType"],
      },
    ],
    order: [["updatedAt", "DESC"]],
  });
}

async function countRequests(filters = {}) {
  return await db.VerificationRequest.count({
    where: filters,
    distinct: true,
    col: "id",
  });
}
async function getAllAdmin({ limit, offset, filters }) {
  return db.VerificationRequest.findAll({
    where: filters,
    include: [
      {
        model: db.Asset,
        as: "assets",
        through: { attributes: [] },
        attributes: ["url", "label", "mediaType"],
      },
    ],
    order: [["updatedAt", "DESC"]],
    limit,
    offset,
  });
}

async function updateAdmin(requestId, updates, t) {
  const request = await db.VerificationRequest.findByPk(requestId, {
    transaction: t,
  });
  if (!request) return null;
  return request.update(updates, { transaction: t });
}

async function getAll(filters = {}) {
  return db.VerificationRequest.findAll({
    where: filters,
    include: [
      {
        model: db.Asset,
        as: "assets",
        through: { attributes: [] },
        attributes: ["url", "label", "mediaType"],
      },
    ],
    order: [["updatedAt", "DESC"]],
  });
}
const verificationRequestRepository = {
  countRequests,
  createRequest,
  findExistingRequest,
  getAllProvider,
  getAllAdmin,
  updateAdmin,
  getAll,
};

export default verificationRequestRepository;
