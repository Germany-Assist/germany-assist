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
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

async function getAvailableIdentityRequests(req, res, next) {
  try {
    const results = await metaServices.getAvailableIdentity();
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
}
const metaController = {
  initCall,
  metaCategoriesForRegister,
  getAvailableIdentityRequests,
};

export default metaController;
