import { useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { GOOGLE_CLIENT_ID } from "../../../config/api";
import { googleRetrieveInfo } from "../../../api/authService";

export default function GoogleLoginButton({
  authStyle,
  handleGoogleResponse,
  signin = false,
}) {
  const { googleLogin } = useAuth();
  const googleRegistration = async (idToken) => {
    const user = await googleRetrieveInfo(idToken);
    return user;
  };
  // Called when Google returns the ID token
  const handleCredentialResponse = async (response) => {
    try {
      if (signin) {
        await googleLogin(response.credential);
      } else {
        const resp = await googleRegistration(response.credential);
        return handleGoogleResponse(resp);
      }
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
        width: 200,
      },
    );

    // Optional: prevent auto One Tap
    window.google.accounts.id.disableAutoSelect();
  }, []);

  return <div id="googleBtn" className={authStyle} />;
}
