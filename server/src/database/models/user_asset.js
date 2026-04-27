import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../configs/database.js";

export default class UserAsset extends Model {}

UserAsset.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
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
    modelName: "UserAsset",
    tableName: "user_assets",
    paranoid: true,
    indexes: [
      {
        unique: true,
        fields: ["user_id", "asset_id"],
      },
    ],
  }
);