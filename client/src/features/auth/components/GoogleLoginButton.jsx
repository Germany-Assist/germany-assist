import { useEffect, useRef } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { GOOGLE_CLIENT_ID } from "../../../config/api";
import { googleRetrieveInfo } from "../../../api/authService";

export default function GoogleLoginButton({
  authStyle,
  handleGoogleResponse,
  signin = false,
}) {
  const { googleLogin } = useAuth();
  const initialized = useRef(false);
  const callbackRef = useRef(handleGoogleResponse);

  // Update ref when handleGoogleResponse changes
  useEffect(() => {
    callbackRef.current = handleGoogleResponse;
  }, [handleGoogleResponse]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    if (!window.google) {
      console.error("Google Identity Services not loaded");
      return;
    }

    const handleCredentialResponse = async (response) => {
      try {
        if (signin) {
          await googleLogin(response.credential);
        } else {
          const resp = await googleRetrieveInfo(response.credential);
          if (callbackRef.current) {
            callbackRef.current(resp);
          }
        }
      } catch (err) {
        console.error("Google login failed", err);
        if (callbackRef.current) {
          callbackRef.current({ success: false, message: err.message || "Google signup failed" });
        }
      }
    };

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
      context: signin ? "signin" : "signup",
      ux_mode: "popup",
    });

    window.google.accounts.id.renderButton(
      document.getElementById("googleBtn"),
      {
        theme: "outline",
        size: "large",
        width: "100%",
        text: signin ? "signin_with" : "signup_with",
      },
    );

    window.google.accounts.id.disableAutoSelect();
  }, [signin, googleLogin]);

  return <div id="googleBtn" className={authStyle} />;
}
