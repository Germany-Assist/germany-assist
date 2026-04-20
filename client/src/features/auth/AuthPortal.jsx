import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import AuthLayout from "./AuthLayout";

const AuthPortal = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <AuthLayout
      title={isLogin ? "Welcome back" : "Create account"}
      subtitle={
        isLogin
          ? "Continue your German journey"
          : "Start your career in Germany"
      }
    >
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? "login" : "signup"}
            initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {isLogin ? (
              <LoginForm onSwitch={() => setIsLogin(false)} />
            ) : (
              <SignupForm onSwitch={() => setIsLogin(true)} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </AuthLayout>
  );
};

export default AuthPortal;
