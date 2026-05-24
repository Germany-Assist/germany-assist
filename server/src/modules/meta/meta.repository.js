import db from "../../database/index.js";

async function getAvailableIdentity() {
  return db.IdentityRequestTypes.findAll({
    raw: true,
    attributes: ["id", "title", "label", "icon", "requirements"],
  });
}

const metaRepository = { getAvailableIdentity };
export default metaRepository;
