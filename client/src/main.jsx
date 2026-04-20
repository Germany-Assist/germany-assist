import { createRoot } from "react-dom/client";
import "./index.css";
import React, { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider, useAuth } from "./contexts/AuthContext.jsx";
import { ProfileProvider } from "./contexts/ProfileContext.jsx";
import { MetaContextProvider } from "./contexts/MetadataContext.jsx";
import { SocketProvider } from "./contexts/SocketContext.jsx";
import { NotificationProvider } from "./contexts/NotificationContext.jsx";
export const BootstrapGate = ({ children }) => {
  const { refreshAccessToken } = useAuth();
  const [bootstrapped, setBootstrapped] = useState(false);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        await refreshAccessToken();
        // Profile will fetch itself automatically because accessToken changed
      } catch (err) {
        // Not logged in, that's fine
      } finally {
        setBootstrapped(true);
      }
    };
    bootstrap();
  }, []);

  if (!bootstrapped) return <div>Loading Application...</div>;
  return children;
};
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MetaContextProvider>
      <BrowserRouter>
        <AuthProvider>
          <ProfileProvider>
            <SocketProvider>
              <NotificationProvider>
                <BootstrapGate>
                    <App />
                </BootstrapGate>
              </NotificationProvider>
            </SocketProvider>
          </ProfileProvider>   
        </AuthProvider>
      </BrowserRouter>
    </MetaContextProvider>
  </React.StrictMode>,
);
