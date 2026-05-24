import hashIdUtil from "../../utils/hashId.util.js";
import categoryRepository from "../category/category.repository.js";
import metaRepository from "./meta.repository.js";

export const initCall = async () => {
  const allCat = await categoryRepository.getAllCategories();
  const categories = allCat.map((i) => ({
    title: i.title,
    label: i.label,
    id: hashIdUtil.hashIdEncode(i.id),
    subcategories:
      i.Subcategories &&
      i.Subcategories.map((sc) => ({
        title: sc.title,
        label: sc.label,
        id: hashIdUtil.hashIdEncode(sc.id),
      })),
  }));
  return { categories };
};
export const metaCategoriesForRegister = async () => {
  const allCat = await categoryRepository.getCategoriesForRegister();
  const categories = allCat.map((i) => ({
    title: i.title,
    label: i.label,
    id: hashIdUtil.hashIdEncode(i.id),
    icon: i.icon,
    requirements: i.requirements,
  }));
  return categories;
};
async function getAvailableIdentity() {
  const types = await metaRepository.getAvailableIdentity();
  const results = types.map((i) => ({
    ...i,
    id: hashIdUtil.hashIdEncode(i.id),
  }));
  return results;
}

const metaServices = {
  initCall,
  metaCategoriesForRegister,
  getAvailableIdentity,
};

export default metaServices;
