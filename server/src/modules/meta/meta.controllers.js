import metaServices from "./meta.services.js";

export const initCall = async (req, res, next) => {
  try {
    const data = await metaServices.initCall();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
export const metaCategoriesForRegister = async (req, res, next) => {
  try {
    const data = await metaServices.metaCategoriesForRegister();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const metaController = { initCall, metaCategoriesForRegister };

export default metaController;
