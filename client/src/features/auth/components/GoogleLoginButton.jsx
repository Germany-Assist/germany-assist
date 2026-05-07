import { useEffect, useCallback } from "react";
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

  const handleCredentialResponse = useCallback(async (response) => {
    try {
      if (signin) {
        await googleLogin(response.credential);
      } else {
        const resp = await googleRegistration(response.credential);
        if (handleGoogleResponse) {
          handleGoogleResponse(resp);
        }
      }
    } catch (err) {
      console.error("Google login failed", err);
      if (handleGoogleResponse) {
        handleGoogleResponse({ success: false, message: err.message || "Google signup failed" });
      }
    }
  }, [signin, googleLogin, googleRegistration, handleGoogleResponse]);

  useEffect(() => {
    if (!window.google) {
      console.error("Google Identity Services not loaded");
      return;
    }

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
      context: signin ? "signin" : "signup",
      ux_mode: "popup",
      login_hint: "",
    });

    window.google.accounts.id.renderButton(
      document.getElementById("googleBtn"),
      {
        theme: "outline",
        size: "large",
        width: "100%",
        text: signin ? "signin_with" : "signup_with",
        shape: "rectangular",
        logo_alignment: "left",
      },
    );

    window.google.accounts.id.disableAutoSelect();
  }, [handleCredentialResponse, signin]);

  return <div id="googleBtn" className={authStyle} />;
}
