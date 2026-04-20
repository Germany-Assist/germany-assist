import {
  useState,
  useContext,
  createContext,
  useEffect,
  useCallback,
} from "react";
import {
  addToFavoriteApi,
  profileRequest,
  removeFromFavoriteApi,
} from "../api/profile";
import { useAuth } from "./AuthContext";

const ProfileContext = createContext(null);

export const ProfileProvider = ({ children }) => {
  const { accessToken } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await profileRequest();
      setProfile(data);
    } catch (err) {
      setError(err);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);
  const toggleFavorite = async (service) => {
    if (profile) {
      const isFav = isInFavorite(service.id);
      const resp = isFav
        ? await removeFromFavorite(service)
        : await addToFavorite(service);
      return resp;
    } else {
      // TODO create error message
    }
  };
  const addToFavorite = async (service) => {
    if (profile && service.id) {
      const resp = await addToFavoriteApi(service.id);
      if (resp) {
        const newFavElement = {
          id: service.id,
          service: {
            id: service.id,
            title: service.title,
            description: service.description,
          },
        };
        setProfile((p) => ({
          ...p,
          favorites: [...p.favorites, newFavElement],
        }));
      }
      return resp;
    } else {
      return false;

      // TODO create error message
    }
  };
  const removeFromFavorite = async (service) => {
    if (profile && service.id) {
      const resp = await removeFromFavoriteApi(service.id);
      if (resp)
        setProfile((p) => ({
          ...p,
          favorites: p.favorites.filter((i) => i.service.id !== service.id),
        }));
      return resp;
    } else {
      return false;

      // TODO create error message
    }
  };
  const isInFavorite = (id) => {
    if (profile) {
      const exist = profile.favorites?.filter((i) => {
        return i.service.id == id;
      });

      if (exist) return exist.length > 0;
    } else {
      return false;
    }
  };

  useEffect(() => {
    if (accessToken) {
      if (!profile) {
        fetchProfile();
      }
    } else {
      setProfile(null);
      setError(null);
    }
  }, [accessToken, fetchProfile]);

  return (
    <ProfileContext.Provider
      value={{
        isInFavorite,
        toggleFavorite,
        profile,
        loading,
        error,
        fetchProfile,
        setProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
