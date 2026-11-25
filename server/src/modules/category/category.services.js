import db from "../../database/index.js";

export const getAllCategories = async () => {
  return await db.Category.findAll({
    attributes: ["id", "title", "label", "icon", "requirements"],
    include: [{ model: db.Subcategory, attributes: ["title", "label", "id"] }],
  });
};
export const createCategory = async (data) => {
  return await db.Category.create({
    requirements: [],
    icon: "📁",
    ...data,
  });
};
export const updateCategory = async (id, data) => {
  return await db.Category.update(data, { where: { id } });
};

const categoryServices = {
  getAllCategories,
  createCategory,
  updateCategory,
};
export default categoryServices;
