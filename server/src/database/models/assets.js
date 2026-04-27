import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../configs/database.js";

class Asset extends Model {}

Asset.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Name cannot be empty" },
      },
    },
    mediaType: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Media type cannot be empty" },
        isIn: {
          args: [["image", "video", "audio", "document"]],
          msg: "Media type must be one of 'image', 'video', 'audio', 'document'",
        },
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: "UserId must be an integer" },
      },
    },
    isLocal: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    confirmed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    size: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: "URL cannot be empty" },
      },
    },
    views: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      validate: {
        isInt: { msg: "views must be an integer" },
        min: { args: [0], msg: "views cannot be negative" },
      },
    },
    thumb: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },

    owner: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.userId;
      },
    },
  },
  {
    sequelize,
    paranoid: true,
  },
);

export default Asset;
