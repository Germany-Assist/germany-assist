import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../configs/database.js";

export default class PostAsset extends Model {}

PostAsset.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    assetId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "PostAsset",
    tableName: "post_assets",
    paranoid: true,
    indexes: [
      {
        unique: true,
        fields: ["post_id", "asset_id"],
      },
    ],
  }
);