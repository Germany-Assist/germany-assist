import {
  DB_NAME,
  DB_PASSWORD,
  DB_USERNAME,
  sequelize,
} from "../configs/database.js";
import seedUsers from "./seeds/users_seeds.js";
import seedPermissions from "./seeds/permission_seed.js";
import seedCategory from "./seeds/category_seed.js";
import { defineConstrains } from "./index.js";
import { NODE_ENV } from "../configs/serverConfig.js";
import seedAssetTypes from "./seeds/assetTypes_seed.js";
import User from "./models/user.js";
import Permission from "./models/permission.js";
import AssetTypes from "./models/assetTypes.js";
import Category from "./models/category.js";
import seedSubcategory from "./seeds/subcategory_seed.js";

export async function initDatabase(exit = true) {
  try {
    if (NODE_ENV == "test" || NODE_ENV == "dev" || NODE_ENV == "staging") {
      //Stage 1
      //Creates the skeleton
      console.log("creating skeleton ⌛");
      await sequelize.sync({ force: true });
      console.log("skeleton was created 👍");
      //Stage 2
      //Seeds the data
      console.log("starting to seeds ⌛");
      await seedAssetTypes();
      await seedPermissions();
      await seedUsers();
      await seedCategory();
      await seedSubcategory();
      console.log("finished seeding 👍");
      //Stage 3
      //Apply the constraints
      console.log("defining constrains ⌛");
      try {
        defineConstrains();
      } catch (error) {
        if (NODE_ENV === "dev") {
          throw new Error("failed to define constrains");
        }
      }
      console.log(DB_USERNAME, DB_PASSWORD, DB_NAME);
      await sequelize.sync({ alter: true });
      console.log("constrains are ready 👍");
      if (exit) {
        await sequelize.close();
        process.exit();
      }
      console.log("script has successful migrated and seeded the database 😀");
    } else {
      throw new Error(
        "should not run this script in the production environment",
      );
    }
  } catch (error) {
    console.log(error);
  }
}
if (NODE_ENV === "dev" || NODE_ENV == "staging") {
  await initDatabase();
}
