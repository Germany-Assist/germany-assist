import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../configs/database.js";

class UserProfile extends Model {}

UserProfile.init(
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
    nationality: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    countryOfResidence: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    displayName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    paranoid: true,
    modelName: "UserProfile",
  },
);

export default UserProfile;
