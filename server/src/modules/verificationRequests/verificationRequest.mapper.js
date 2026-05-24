import { generateDownloadUrl } from "../../configs/s3Configs.js";
import hashIdUtil from "../../utils/hashId.util.js";

const singleRequestMapper = async (request) => {
  const assets = request.verificationRequestAssets?.map((i) => i.Asset) || [];
  return {
    id: hashIdUtil.hashIdEncode(request.id),
    serviceProviderId: request.serviceProviderId,
    type: request.type,
    status: request.status,
    adminNote: request.adminNote,
    assets: await Promise.all(
      assets.filter(Boolean).map(async (i) => ({
        url: await generateDownloadUrl(i.url),
        label: i.label,
      })),
    ),
  };
};
const multiRequestMapper = async (requests) => {
  return await Promise.all(
    requests.map(async (i) => {
      return {
        id: hashIdUtil.hashIdEncode(i.id),
        serviceProviderId: i.serviceProviderId,
        type: i.type,
        status: i.status,
        adminNote: i.adminNote,
        expDate: i.expDate,
        relatedId: hashIdUtil.hashIdEncode(i.relatedId),
        assets: await Promise.all(
          i.assets.filter(Boolean).map(async (x) => ({
            url: await generateDownloadUrl(x.url),
            label: x.label,
          })),
        ),
      };
    }),
  );
};
const verificationRequestMappers = { multiRequestMapper, singleRequestMapper };
export default verificationRequestMappers;
