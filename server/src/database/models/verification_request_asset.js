import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../configs/database.js";

export default class VerificationRequestAsset extends Model {}

VerificationRequestAsset.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    verificationRequestId: {
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
    modelName: "VerificationRequestAsset",
    tableName: "verification_request_assets",
    paranoid: true,
    indexes: [
      {
        unique: true,
        fields: ["verification_request_id", "asset_id"],
      },
    ],
  }
);