import { v4 as uuid } from "uuid";
import path from "node:path";
import sharpUtil from "../utils/sharp.util.js";
import { AppError } from "../utils/error.class.js";
import AssetRepository from "../modules/assets/assets.repository.js";

/**
 * ============================================================================
 * AssetService - Centralized Asset Upload Service
 * ============================================================================
 *
 * This service provides a unified interface for uploading files to S3 and
 * creating asset records with junction table entries.
 *
 * HOW IT WORKS:
 * - Each asset type (defined in asset-types table) has an 'ownerType' field
 * - ownerType determines which junction table to use for counting limits
 *   and creating associations:
 *
 *   | ownerType           | Junction Table        | Count Method            |
 *   |---------------------|-----------------------|-------------------------|
 *   | user                | user_assets           | countUserAssets()      |
 *   | service             | service_assets        | countServiceAssets()   |
 *   | post                | post_assets           | countPostAssets()      |
 *   | verificationRequest | verification_request_ | countVerificationAssets|
 *
 * USAGE:
 *   const result = await AssetService.uploadAsset({
 *     files: [file1, file2],
 *     ownerId: 123,              // userId, serviceId, postId, or verificationRequestId
 *     typeKey: "userImage",     // from assetTypes table (determines constraints + junction)
 *     userId: 1,                // the user uploading (for Asset.userId field)
 *     transaction: t
 *   });
 *
 * HOW TO ADD NEW ASSET TYPES:
 *   1. Add entry to asset_types table/seed with appropriate ownerType
 *   2. If new ownerType (e.g., "order"), add corresponding count/insert methods:
 *      - countOrderAssets(ownerId, transaction)
 *      - addToOrder(orderId, assetIds, transaction)
 *   3. Add case in getJunctionMethods() below
 *
 * EXAMPLES:
 *   // User uploads profile image
 *   await AssetService.uploadAsset({
 *     files: [file],
 *     ownerId: userId,
 *     typeKey: "userImage",
 *     userId: authUserId,
 *     transaction: t
 *   });
 *
 *   // Service provider uploads service image
 *   await AssetService.uploadAsset({
 *     files: [file],
 *     ownerId: serviceId,
 *     typeKey: "serviceProfileImage",
 *     userId: authUserId,
 *     transaction: t
 *   });
 *
 *   // User uploads verification documents
 *   await AssetService.uploadAsset({
 *     files: [file],
 *     ownerId: verificationRequestId,
 *     typeKey: "verificationDocument",
 *     userId: authUserId,
 *     transaction: t
 *   });
 *
 *   // User uploads post attachments
 *   await AssetService.uploadAsset({
 *     files: [file],
 *     ownerId: postId,
 *     typeKey: "postAttachmentsImage",
 *     userId: authUserId,
 *     transaction: t
 *   });
 * ============================================================================
 */

class AssetService {
  /**
   * Main upload method - handles all asset types
   * @param {Object} params
   * @param {Array} params.files - array of file objects { buffer, originalname, mimetype }
   * @param {number} params.ownerId - the ID of the owner (userId, serviceId, postId, verificationRequestId)
   * @param {string} params.typeKey - asset type key (e.g., "userImage", "serviceProfileImage")
   * @param {number} params.userId - the user uploading (stored in Asset.userId)
   * @param {Object} params.transaction - DB transaction
   * @returns {Object} { urls: [...], assets: [...] }
   */
  static async uploadAsset({ files, ownerId, typeKey, userId, transaction }) {
    if (!transaction) throw new AppError(400, "Transaction is required");
    if (!files || files.length === 0) {
      throw new AppError(400, "No files provided");
    }

    // 1️⃣ Get constraints from AssetTypes table
    const constraints = await AssetRepository.extractConstrains(typeKey);
    const ownerType = constraints.ownerType;

    // 2️⃣ Get junction methods based on ownerType
    const junctionMethods = this.getJunctionMethods(ownerType);

    // 3️⃣ Validate file count (check existing assets in junction table)
    await this.validateFileCount(
      files.length,
      ownerId,
      constraints,
      junctionMethods,
      transaction,
    );

    // 4️⃣ Validate file sizes
    this.validateFileSizes(files, constraints);

    // 5️⃣ Format files for S3 based on media type
    const filesToUpload = await this.formatFiles(files, typeKey, constraints);

    // 6️⃣ Upload to S3
    await AssetRepository.uploadToS3(filesToUpload);

    // 7️⃣ Create Asset records
    const assetRecords = this.formatAssetRecords(filesToUpload, userId);
    const createdAssets = await AssetRepository.saveAssets(assetRecords, transaction);

    // 8️⃣ Create junction table records
    const assetIds = createdAssets.map((a) => a.id);
    await junctionMethods.insert(ownerId, assetIds, transaction);

    // 9️⃣ Generate signed URLs
    const publicUrls = await AssetRepository.generateSignedUrls(filesToUpload);

    return { urls: publicUrls, assets: createdAssets };
  }

  // ------------------- Junction Table Methods Mapping -------------------

  /**
   * Returns count and insert methods based on ownerType
   * To add new ownerType support:
   *   1. Add new case below
   *   2. Add corresponding methods to AssetRepository
   */
  static getJunctionMethods(ownerType) {
    const methods = {
      user: {
        count: (ownerId, transaction) =>
          AssetRepository.countUserAssets(ownerId, transaction),
        insert: (ownerId, assetIds, transaction) =>
          AssetRepository.addToUser(ownerId, assetIds, transaction),
      },
      service: {
        count: (ownerId, transaction) =>
          AssetRepository.countServiceAssets(ownerId, transaction),
        insert: (ownerId, assetIds, transaction) =>
          AssetRepository.addToService(ownerId, assetIds, transaction),
      },
      post: {
        count: (ownerId, transaction) =>
          AssetRepository.countPostAssets(ownerId, transaction),
        insert: (ownerId, assetIds, transaction) =>
          AssetRepository.addToPost(ownerId, assetIds, transaction),
      },
      verificationRequest: {
        count: (ownerId, transaction) =>
          AssetRepository.countVerificationAssets(ownerId, transaction),
        insert: (ownerId, assetIds, transaction) =>
          AssetRepository.addToVerificationRequest(ownerId, assetIds, transaction),
      },
    };

    if (!methods[ownerType]) {
      throw new AppError(
        500,
        `Unsupported ownerType: ${ownerType}. Add support in getJunctionMethods()`,
      );
    }

    return methods[ownerType];
  }

  // ------------------- Validation Helpers -------------------

  static async validateFileCount(
    totalFiles,
    ownerId,
    constraints,
    junctionMethods,
    transaction,
  ) {
    // Skip limit check if limit is "*" (unlimited)
    if (constraints.limit === "*") return;

    const currentCount = await junctionMethods.count(ownerId, transaction);

    if (currentCount + totalFiles > constraints.limit) {
      throw new AppError(
        400,
        `Upload limit exceeded (${constraints.limit}) for this asset type`,
      );
    }
  }

  static validateFileSizes(files, constraints) {
    // Skip size check if size is "*" (unlimited)
    if (constraints.size === "*") return;

    for (const file of files) {
      if (file.buffer.length > constraints.size) {
        throw new AppError(
          413,
          `File size exceeds allowed limit (${constraints.size} bytes)`,
        );
      }
    }
  }

  // ------------------- Format Helpers -------------------

  static async formatFiles(files, typeKey, constraints) {
    switch (constraints.mediaType) {
      case "image":
        return this.formatImages(files, typeKey, constraints);
      case "video":
        return this.formatVideos(files, typeKey, constraints);
      case "document":
        return this.formatDocuments(files, typeKey, constraints);
      default:
        throw new AppError(500, `Invalid media type: ${constraints.mediaType}`);
    }
  }

  static async formatImages(files, typeKey, constraints) {
    const basekey = constraints.basekey;
    const thumb = constraints.thumb;
    const images = [];

    for (const file of files) {
      const id = uuid();
      const imageKey = `${basekey}/${id}.webp`;
      const imageBuffer = await sharpUtil.imageResizeS3(file, 400, 400);

      images.push({
        key: imageKey,
        buffer: imageBuffer,
        type: typeKey,
        thumb: false,
        id,
        size: imageBuffer.length,
        contentType: "image/webp",
      });

      if (thumb) {
        const thumbKey = `${basekey}/thumb/${id}.webp`;
        const thumbBuffer = await sharpUtil.imageResizeS3(file, 200, 200);

        images.push({
          key: thumbKey,
          buffer: thumbBuffer,
          type: typeKey,
          thumb: true,
          id,
          size: thumbBuffer.length,
          contentType: "image/webp",
        });
      }
    }

    return images;
  }

  static formatVideos(files, typeKey, constraints) {
    const baseKey = constraints.basekey;
    return files.map((file) => {
      const id = uuid();
      const ext = path.extname(file.originalname);
      return {
        key: `${baseKey}/${id}${ext}`,
        buffer: file.buffer,
        type: typeKey,
        thumb: false,
        id,
        size: file.buffer.length,
      };
    });
  }

  static formatDocuments(files, typeKey, constraints) {
    const baseKey = constraints.basekey;
    return files.map((file) => {
      const id = uuid();
      const ext = path.extname(file.originalname);
      return {
        key: `${baseKey}/${id}${ext}`,
        buffer: file.buffer,
        type: typeKey,
        thumb: false,
        id,
        size: file.buffer.length,
      };
    });
  }

  static formatAssetRecords(filesToUpload, userId) {
    return filesToUpload.map((file) => ({
      name: file.id,
      size: file.size,
      mediaType: file.contentType?.split("/")[0] || "image",
      userId,
      key: file.type,
      thumb: file.thumb,
      url: file.key,
      confirmed: true,
    }));
  }
}

export default AssetService;
