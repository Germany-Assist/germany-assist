import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../configs/database.js";

export default class ServiceAsset extends Model {}

ServiceAsset.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    serviceId: {
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
    modelName: "ServiceAsset",
    tableName: "service_assets",
    paranoid: true,
    indexes: [
      {
        unique: true,
        fields: ["service_id", "asset_id"],
      },
    ],
  }
);