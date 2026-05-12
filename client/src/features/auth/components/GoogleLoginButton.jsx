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
  const callbackRef = useRef(handleGoogleResponse);

  // Keep the callback ref up to date
  useEffect(() => {
    callbackRef.current = handleGoogleResponse;
  }, [handleGoogleResponse]);

  useEffect(() => {
    // Initialize the Google client in the background
    const initializeGoogle = () => {
      if (!window.google?.accounts?.id) return;

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        // Using 'none' for auto_select ensures the popup only shows on click
        auto_select: false,
        context: signin ? "signin" : "signup",
      });
    };

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
        console.error("Google operation failed", err);
        if (callbackRef.current) {
          callbackRef.current({
            success: false,
            message: err.message || "Google authentication failed",
          });
        }
      }
    };

    // Load check
    if (window.google) {
      initializeGoogle();
    } else {
      const script = document.querySelector(
        'script[src="https://accounts.google.com/gsi/client"]',
      );
      script?.addEventListener("load", initializeGoogle);
    }
  }, [signin, googleLogin]);

  /**
   * This function triggers the actual Google Account Picker.
   * Because it's called via a user click, it bypasses popup blockers.
   */
  const handleCustomClick = () => {
    // We create a one-time hidden container
    const hiddenDiv = document.createElement("div");

    window.google.accounts.id.renderButton(hiddenDiv, {
      type: "standard",
    });

    // Find the actual button inside Google's generated HTML and click it
    const actualBtn = hiddenDiv.querySelector('div[role="button"]');
    if (actualBtn) {
      actualBtn.click();
    } else {
      // If the button didn't render (rare), fallback to prompt
      window.google.accounts.id.prompt();
    }
  };

  return (
    <button
      type="button"
      onClick={handleCustomClick}
      className={authStyle}
      style={{
        /* 
           Below is a base style that mimics Google's clean look. 
           Since this is a real <button>, your 'authStyle' (Tailwind/CSS) 
           will now actually work! 
        */
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        cursor: "pointer",
        transition: "background-color 0.2s ease",
      }}
    >
      {/* Standard Google "G" Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        style={{ width: "20px", height: "20px" }}
      >
        <path
          fill="#FFC107"
          d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
        />
        <path
          fill="#FF3D00"
          d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
        />
        <path
          fill="#4CAF50"
          d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
        />
        <path
          fill="#1976D2"
          d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
        />
      </svg>
      <span>{signin ? "Sign in with Google" : "Sign up with Google"}</span>
    </button>
  );
}
