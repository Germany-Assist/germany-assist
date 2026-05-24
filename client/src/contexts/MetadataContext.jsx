import { useContext, useState, useEffect, createContext } from "react";
import {
  fetchMetadata,
  fetchCategoriesForRegister,
  fetchIdentityRequests,
} from "../api/meta.api";

const MetaContext = createContext(null);

export const MetaContextProvider = ({ children }) => {
  const [meta, setMeta] = useState(null);
  const [categories, setCategories] = useState([]);
  const [availableCategoryTypes, setAvailableCategoryTypes] = useState(null);
  const [availableIdentityTypes, setAvailableIdentityTypes] = useState(null);

  useEffect(() => {
    (async () => {
      const [metaResp, categoriesResp, identitiesResp] = await Promise.all([
        fetchMetadata(),
        fetchCategoriesForRegister(),
        fetchIdentityRequests(),
      ]);
      if (metaResp.status !== 200) {
        throw Error("failed to connect to server");
      }
      setMeta(metaResp.data);
      setCategories(metaResp.data.categories);
      setAvailableCategoryTypes(categoriesResp.data);
      setAvailableIdentityTypes(identitiesResp.data);
    })();
  }, []);

  return (
    <MetaContext.Provider
      value={{
        meta,
        categories,
        availableCategoryTypes,
        availableIdentityTypes,
      }}
    >
      {children}
    </MetaContext.Provider>
  );
};

export const useMeta = () => {
  const metaContext = useContext(MetaContext);
  if (!metaContext)
    throw Error("meta context should only be used inside MetadataProvider");
  return metaContext;
};
