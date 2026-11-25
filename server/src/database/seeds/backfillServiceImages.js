import { pathToFileURL } from "node:url";
import { v4 as uuidv4 } from "uuid";

import { sequelize } from "../../configs/database.js";
import db from "../index.js";
import { getServiceCoverImage } from "../../configs/serviceImages.js";

/**
 * Gives every service without a cover asset a category-based external image.
 *
 * This is intended for demo/seed data. Real provider uploads are never touched:
 * only services whose `assets` association is empty are backfilled.
 */
export async function backfillServiceImages() {
  const services = await db.Service.findAll({
    attributes: ["id", "userId"],
    include: [
      {
        model: db.Asset,
        as: "assets",
        attributes: ["id", "mediaType"],
        required: false,
      },
      {
        model: db.Subcategory,
        attributes: ["id", "title"],
        required: false,
        include: [{ model: db.Category, attributes: ["title"] }],
      },
    ],
  });

  const missing = services.filter(
    (service) =>
      !service.assets?.some((asset) => asset.mediaType === "image"),
  );
  if (missing.length === 0) return 0;

  const transaction = await sequelize.transaction();
  try {
    for (const service of missing) {
      const imageUrl = getServiceCoverImage(
        service.Subcategory?.Category?.title,
        service.id,
      );
      const asset = await db.Asset.create(
        {
          name: uuidv4(),
          mediaType: "image",
          userId: service.userId,
          isLocal: false,
          key: "serviceProfileImage",
          confirmed: true,
          size: 0,
          url: imageUrl,
          thumb: false,
          label: "Service cover",
        },
        { transaction },
      );
      await db.ServiceAsset.create(
        { serviceId: service.id, assetId: asset.id },
        { transaction },
      );
    }
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }

  return missing.length;
}

const isMain =
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain) {
  try {
    const count = await backfillServiceImages();
    console.log(
      count > 0
        ? `🖼️  Added cover images to ${count} services`
        : "🖼️  Every service already has a cover image",
    );
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to backfill service images:", error);
    await sequelize.close();
    process.exit(1);
  }
}

export default backfillServiceImages;
