import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../configs/database.js";

class VerificationRequest extends Model {}

VerificationRequest.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: "User must be an integer" },
      },
    },
    serviceProviderId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        isInt: { msg: "ServiceProviderId must be an integer" },
        min: { args: [1], msg: "ServiceProviderId must be greater than 0" },
      },
    },
    type: {
      type: DataTypes.ENUM("identity", "category", "badge"),
      allowNull: false,
      validate: {
        isIn: {
          args: [["identity", "category", "badge"]],
          msg: "Type must be one of 'identity', 'category', 'badge'",
        },
      },
    },
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected", "adminRequest"),
      allowNull: false,
      defaultValue: "pending",
      validate: {
        isIn: {
          args: [["pending", "approved", "rejected", "adminRequest"]],
          msg: "Status must be 'adminRequest', 'pending', 'approved', or 'rejected'",
        },
      },
    },
    adminNote: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    relatedId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        isInt: { msg: "RelatedId must be an integer" },
        min: { args: [1], msg: "RelatedId must be greater than 0" },
      },
    },
    expDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "verification_requests",
    paranoid: true,
  },
);

export default VerificationRequest;
