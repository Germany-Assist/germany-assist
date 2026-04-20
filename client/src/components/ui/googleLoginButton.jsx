import { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { GOOGLE_CLIENT_ID } from "../../config/api";

export default function GoogleLoginButton() {
  const { googleLogin } = useAuth();

  // Called when Google returns the ID token
  const handleCredentialResponse = async (response) => {
    try {
      await googleLogin(response.credential);
    } catch (err) {
      console.error("Google login failed", err);
    }
  };

  useEffect(() => {
    if (!window.google) {
      console.error("Google Identity Services not loaded");
      return;
    }

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
    });

    window.google.accounts.id.renderButton(
      document.getElementById("googleBtn"),
      {
        theme: "outline",
        size: "large",
        width: "100%",
      },
    );

    // Optional: prevent auto One Tap
    window.google.accounts.id.disableAutoSelect();
  }, []);

  return (
    <div className="w-full">
      <div id="googleBtn" className="w-full flex justify-center" />
    </div>
  );
}
