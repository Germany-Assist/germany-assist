import { pathToFileURL } from "node:url";
import { v4 as uuidv4 } from "uuid";

import { sequelize } from "../../configs/database.js";
import db from "../index.js";
import { getServiceCoverImage } from "../../configs/serviceImages.js";

/**
 * Gives demo services without a cover asset a title/category-based image.
 *
 * Real provider uploads are never touched. Pass `refreshExternal: true` to
 * also re-point previously seeded external images after the mapping changes.
 */
export async function backfillServiceImages({ refreshExternal = false } = {}) {
  const services = await db.Service.findAll({
    attributes: ["id", "title", "userId"],
    include: [
      {
        model: db.Asset,
        as: "assets",
        attributes: ["id", "mediaType", "isLocal"],
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

  const transaction = await sequelize.transaction();
  let created = 0;
  let refreshed = 0;

  try {
    for (const service of services) {
      const imageUrl = getServiceCoverImage(
        service.Subcategory?.Category?.title,
        service.id,
        service.title,
      );
      const imageAssets = (service.assets || []).filter(
        (asset) => asset.mediaType === "image",
      );

      if (imageAssets.length === 0) {
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
        created += 1;
      } else if (refreshExternal) {
        const externalAssets = imageAssets.filter((asset) => !asset.isLocal);
        if (externalAssets.length > 0) {
          await db.Asset.update(
            { url: imageUrl },
            {
              where: {
                id: externalAssets.map((asset) => asset.id),
                isLocal: false,
              },
              transaction,
            },
          );
          refreshed += externalAssets.length;
        }
      }
    }

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }

  return { created, refreshed };
}

const isMain =
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain) {
  try {
    const { created, refreshed } = await backfillServiceImages({
      refreshExternal: process.argv.includes("--refresh"),
    });
    console.log(
      `🖼️  Service covers: ${created} created, ${refreshed} refreshed`,
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
