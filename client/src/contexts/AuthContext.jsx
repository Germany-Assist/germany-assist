import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { jwtDecode } from "jwt-decode";
import { setupInterceptors } from "../api/client";
import {
  loginRequest,
  refreshTokenRequest,
  logoutRequest,
  signUpRequest,
  googleLoginRequest,
} from "../api/authService";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const refreshTimeoutRef = useRef(null);
  const navigate = useNavigate();

  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  const isAuthenticated = Boolean(accessToken);

  // 1. Helper to clear everything
  const clearAuthState = useCallback(() => {
    if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current);
    setUser(null);
    setAccessToken(null);
    setAuthLoading(false);
  }, []);

  // 2. Token Refresh Logic
  const refreshAccessToken = useCallback(async () => {
    try {
      const newToken = await refreshTokenRequest();
      setAccessToken(newToken);
      scheduleRefresh(newToken);
      return newToken;
    } catch (err) {
      clearAuthState();
      throw err;
    }
  }, [clearAuthState]);

  // 3. Logout Logic
  const logOut = useCallback(
    async (goHome) => {
      try {
        await logoutRequest();
      } catch (err) {
        console.warn("Server logout failed, clearing local state.");
      } finally {
        clearAuthState();
        if (goHome) navigate("/");
      }
    },
    [clearAuthState, navigate],
  );

  // 4. JWT Schedule Logic
  const scheduleRefresh = (token) => {
    if (!token) return;
    if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current);

    try {
      const { exp } = jwtDecode(token);
      // Refresh 5 seconds before expiry
      const delay = exp * 1000 - Date.now() - 5000;

      if (delay <= 0) {
        refreshAccessToken();
      } else {
        refreshTimeoutRef.current = setTimeout(refreshAccessToken, delay);
      }
    } catch (error) {
      console.error("Invalid token during scheduling", error);
      logOut();
    }
  };

  // 5. Setup Interceptors
  useEffect(() => {
    setupInterceptors({
      getAccessToken: () => accessToken,
      refreshAccessToken,
      onLogout: logOut,
    });
  }, [accessToken, refreshAccessToken, logOut]);

  // 6. Auth Actions
  const login = async (credentials) => {
    const { user, accessToken } = await loginRequest(credentials);
    setUser(user);
    setAccessToken(accessToken);
    scheduleRefresh(accessToken);
    return { user, accessToken };
  };

  const signUp = async (data) => {
    const { user, accessToken } = await signUpRequest(data);
    setUser(user);
    setAccessToken(accessToken);
    scheduleRefresh(accessToken);
    return { user, accessToken };
  };

  const googleLogin = async (idToken) => {
    const { user, accessToken } = await googleLoginRequest(idToken);
    setUser(user);
    setAccessToken(accessToken);
    scheduleRefresh(accessToken);
    navigate("/");
    return { user, accessToken };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated,
        authLoading,
        setAuthLoading,
        login,
        signUp,
        googleLogin,
        logOut,
        refreshAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
