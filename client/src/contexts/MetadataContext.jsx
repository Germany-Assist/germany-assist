import { useContext, useState, useEffect, createContext } from "react";
import { fetchMetadata } from "../api/meta.api";

const MetaContext = createContext(null);

export const MetaContextProvider = ({ children }) => {
  const [meta, setMeta] = useState(null);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    (async () => {
      const resp = await fetchMetadata();
      if (resp.status !== 200) {
        throw Error("failed to connect to server");
      }
      setMeta(resp.data);
      setCategories(resp.data.categories);
    })();
  }, []);
  return (
    <MetaContext.Provider value={{ meta, categories }}>
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
