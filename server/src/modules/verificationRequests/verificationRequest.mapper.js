import { generateDownloadUrl } from "../../configs/s3Configs.js";
import hashIdUtil from "../../utils/hashId.util.js";

const singleRequestMapper = async (request) => {
  const assets = request.assets || [];
  return {
    id: hashIdUtil.hashIdEncode(request.id),
    serviceProviderId: request.serviceProviderId,
    type: request.type,
    status: request.status,
    adminNote: request.adminNote || null,
    expDate: request.expDate || null,
    relatedId: hashIdUtil.hashIdEncode(request.relatedId),
    assets: await Promise.all(
      assets.filter(Boolean).map(async (i) => ({
        url: await generateDownloadUrl(i.url),
        label: i.label,
        mediaType: i.mediaType,
      })),
    ),
  };
};

const multiRequestMapper = async (requests) => {
  return await Promise.all(requests.map((i) => singleRequestMapper(i)));
};

const verificationRequestMappers = { multiRequestMapper, singleRequestMapper };
export default verificationRequestMappers;
