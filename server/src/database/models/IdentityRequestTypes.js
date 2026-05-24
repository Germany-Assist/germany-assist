import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../configs/database.js";

class IdentityRequestTypes extends Model {}

IdentityRequestTypes.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    label: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    requirements: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    paranoid: true,
  },
);

export default IdentityRequestTypes;
