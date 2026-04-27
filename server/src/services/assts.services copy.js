import { v4 as uuid } from "uuid";
import path from "node:path";
import sharpUtil from "../utils/sharp.util.js";
import hashIdUtil from "../utils/hashId.util.js";
import { AppError } from "../utils/error.class.js";
import AssetRepository from "../modules/assets/assets.repository.js";

// ─── Constants ────────────────────────────────────────────────────────────────

const MEDIA_FORMATTERS = {
  image: formatImage,
  video: formatVideo,
  document: formatDocument,
};

const OWNER_FILTER_BUILDERS = {
  serviceProvider: (auth, params) => {
    requireRelatedId(auth);
    return { serviceProviderId: auth.relatedId };
  },
  service: (auth, params) => {
    requireRelatedId(auth);
    return {
      serviceProviderId: auth.relatedId,
      serviceId: hashIdUtil.hashIdDecode(params.id),
    };
  },
  post: (auth, params) => {
    requireRelatedId(auth);
    return {
      serviceProviderId: auth.relatedId,
      postId: hashIdUtil.hashIdDecode(params.id),
    };
  },
  verificationRequest: (auth, params) => {
    requireRelatedId(auth);
    return {
      serviceProviderId: auth.relatedId,
      verificationRequestId: hashIdUtil.hashIdDecode(params.id),
    };
  },
  user: (auth) => ({ userId: auth.id }),
};

// ─── AssetService ──────────────────────────────────────────────────────────────

class AssetService {
  /**
   * Upload one or more files (images, videos, documents).
   *
   * @param {object}   options
   * @param {string}   options.type        - Asset type key (must exist in constraints table)
   * @param {File[]}   options.files       - Array of file objects { buffer, originalname, mimetype }
   * @param {object}   options.auth        - Authenticated user  { id, relatedId }
   * @param {object}  [options.params]     - Route params e.g. { id } for service/post/etc.
   * @param {object}   options.transaction - Active DB transaction (required)
   * @returns {Promise<object[]>}            Signed URLs for the uploaded files
   */
  static async upload({ type, files, auth, params = {}, transaction }) {
    assertTransaction(transaction);
    assertFiles(files);

    const constraints = await AssetRepository.extractConstrains(type);
    const searchFilters = buildSearchFilters(type, auth, params, constraints);

    await assertUploadLimits(
      type,
      files,
      searchFilters,
      constraints,
      transaction,
    );

    const formatter = MEDIA_FORMATTERS[constraints.mediaType];
    if (!formatter)
      throw new AppError(
        500,
        `Unsupported media type: ${constraints.mediaType}`,
      );

    const filesToUpload = await formatter(files, type, constraints);

    await AssetRepository.uploadToS3(filesToUpload);

    const assetRecords = buildAssetRecords(
      filesToUpload,
      auth,
      searchFilters,
      constraints.mediaType,
    );
    await AssetRepository.saveAssets(assetRecords, transaction);

    return AssetRepository.generateSignedUrls(filesToUpload);
  }
}

export default AssetService;

// ─── Search filter builder ─────────────────────────────────────────────────────

function buildSearchFilters(type, auth, params, constraints) {
  const builder = OWNER_FILTER_BUILDERS[constraints.ownerType];
  if (!builder)
    throw new AppError(500, `Unknown owner type: ${constraints.ownerType}`);
  return { key: type, ...builder(auth, params) };
}

// ─── Validation helpers ────────────────────────────────────────────────────────

function assertTransaction(transaction) {
  if (!transaction) throw new AppError(400, "A DB transaction is required");
}

function assertFiles(files) {
  if (!files?.length) throw new AppError(400, "No files provided");
}

function requireRelatedId(auth) {
  if (!auth.relatedId)
    throw new AppError(500, "Invalid upload attempt: missing relatedId");
}

async function assertUploadLimits(
  type,
  files,
  searchFilters,
  constraints,
  transaction,
) {
  // Size check (per file)
  if (constraints.size !== "*") {
    const oversized = files.find((f) => f.buffer.length > constraints.size);
    if (oversized)
      throw new AppError(
        413,
        `File size exceeds the allowed limit for "${type}"`,
      );
  }

  // Count check (across existing + incoming)
  if (constraints.limit !== "*") {
    const currentCount = await AssetRepository.countAssets(
      searchFilters,
      transaction,
    );
    if (currentCount + files.length > constraints.limit) {
      throw new AppError(
        400,
        `Upload limit of ${constraints.limit} exceeded for "${type}"`,
      );
    }
  }
}

// ─── File formatters ───────────────────────────────────────────────────────────

async function formatImage(files, type, constraints) {
  const { basekey, thumb } = constraints;
  const result = [];

  for (const file of files) {
    const id = uuid();

    const imageBuffer = await sharpUtil.imageResizeS3(file, 400, 400);
    result.push(
      makeFileEntry({
        id,
        type,
        basekey,
        suffix: "",
        buffer: imageBuffer,
        thumb: false,
      }),
    );

    if (thumb) {
      const thumbBuffer = await sharpUtil.imageResizeS3(file, 200, 200);
      result.push(
        makeFileEntry({
          id,
          type,
          basekey,
          suffix: "/thumb",
          buffer: thumbBuffer,
          thumb: true,
        }),
      );
    }
  }

  return result;
}

function formatVideo(files, type, constraints) {
  return files.map((file) => {
    const id = uuid();
    const ext = path.extname(file.originalname);
    return {
      key: `${constraints.basekey}/${id}${ext}`,
      buffer: file.buffer,
      contentType: file.mimetype,
      type,
      thumb: false,
      id,
      size: file.buffer.length,
    };
  });
}

function formatDocument(files, type, constraints) {
  return files.map((file) => {
    const id = uuid();
    const ext = path.extname(file.originalname);
    return {
      key: `${constraints.basekey}/${id}${ext}`,
      buffer: file.buffer,
      contentType: file.mimetype,
      type,
      thumb: false,
      id,
      size: file.buffer.length,
    };
  });
}

// ─── Shared helpers ────────────────────────────────────────────────────────────

function makeFileEntry({ id, type, basekey, suffix, buffer, thumb }) {
  return {
    key: `${basekey}${suffix}/${id}.webp`,
    buffer,
    contentType: "image/webp",
    type,
    thumb,
    id,
    size: buffer.length,
  };
}

function buildAssetRecords(files, auth, searchFilters, mediaType) {
  return files.map((file) => ({
    name: file.id,
    size: file.size,
    mediaType,
    userId: auth.id,
    serviceProviderId: auth.relatedId ?? null,
    serviceId: searchFilters.serviceId ?? null,
    postId: searchFilters.postId ?? null,
    verificationRequestId: searchFilters.verificationRequestId ?? null,
    key: file.type,
    thumb: file.thumb,
    url: file.key,
    confirmed: true,
  }));
}
