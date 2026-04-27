import db from "../../database/index.js";
import s3Utils from "../../configs/s3Configs.js";
import { AppError } from "../../utils/error.class.js";

class AssetRepository {
  // Upload files to S3
  static async uploadToS3(files) {
    return s3Utils.uploadFilesToS3(files);
  }

  static async findProfileImageId() {
    const x = await db.User.findOne({
      attributes: ["id"],
      include: [
        {
          model: db.Asset,
          required: true,
          as: "profilePicture",
          attributes: ["id"],
        },
      ],
    });
    if (!x) return null;
    const repose = x.get({ plain: true });
    return repose.profilePicture.map((i) => i.id);
  }
  // Save asset metadata to DB
  static async saveAssets(assets, transaction) {
    return db.Asset.bulkCreate(assets, { transaction, returning: true });
  }

  // Generate signed URLs
  static async generateSignedUrls(files, expire = 3600) {
    const result = [];
    for (const file of files) {
      const url = await s3Utils.generateDownloadUrl(file.key, expire);
      result.push({ ...file, url });
    }
    return result;
  }

  // Count assets for limits
  static async countAssets(filters, transaction) {
    return db.Asset.count({
      where: { ...filters, confirmed: true },
      transaction,
    });
  }

  // Delete assets
  // static async deleteAssets(filters) {
  //   const assets = await db.Asset.findAll({ where: filters });
  //   const keys = assets.map((a) => a.key);
  //   if (keys.length) await s3Utils.deleteObjects(keys);
  //   return db.Asset.destroy({ where: filters });
  // }

  static async deleteAssets(options) {
    return await db.Asset.destroy(options);
  }

  static async extractConstrains(type) {
    const con = await db.AssetTypes.findOne({
      where: { key: type },
      raw: true,
    });
    if (!con) throw new AppError(500, "invalid constrain key type", false);
    return con;
  }

  static async markAsUnconfirmed(assetIds, transaction) {
    return db.Asset.update(
      { confirmed: false },
      { where: { id: assetIds }, transaction },
    );
  }

  static async addToPost(postId, assetIds, transaction) {
    const records = assetIds.map((assetId) => ({ postId, assetId }));
    return db.PostAsset.bulkCreate(records, { transaction, ignoreDuplicates: true });
  }

  static async addToService(serviceId, assetIds, transaction) {
    const records = assetIds.map((assetId) => ({ serviceId, assetId }));
    return db.ServiceAsset.bulkCreate(records, { transaction, ignoreDuplicates: true });
  }

  static async addToUser(userId, assetIds, transaction) {
    const records = assetIds.map((assetId) => ({ userId, assetId }));
    return db.UserAsset.bulkCreate(records, { transaction, ignoreDuplicates: true });
  }

  static async addToVerificationRequest(verificationRequestId, assetIds, transaction) {
    const records = assetIds.map((assetId) => ({ verificationRequestId, assetId }));
    return db.VerificationRequestAsset.bulkCreate(records, { transaction, ignoreDuplicates: true });
  }

  // ------------------- Count Methods for Junction Tables -------------------

  static async countUserAssets(userId, transaction) {
    return db.UserAsset.count({ where: { userId }, transaction });
  }

  static async countServiceAssets(serviceId, transaction) {
    return db.ServiceAsset.count({ where: { serviceId }, transaction });
  }

  static async countPostAssets(postId, transaction) {
    return db.PostAsset.count({ where: { postId }, transaction });
  }

  static async countVerificationAssets(verificationRequestId, transaction) {
    return db.VerificationRequestAsset.count({ where: { verificationRequestId }, transaction });
  }
}

export default AssetRepository;
