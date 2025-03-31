
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import { useAuth } from "@/context/AuthContext";

const AuthPage: React.FC = () => {
  const [isLoginForm, setIsLoginForm] = useState(true);
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-white to-closet-purple/10">
      <div className="max-w-md w-full mx-auto bg-white shadow-lg rounded-xl p-8">
        {isLoginForm ? (
          <LoginForm onToggleForm={() => setIsLoginForm(false)} />
        ) : (
          <RegisterForm onToggleForm={() => setIsLoginForm(true)} />
        )}
      </div>
    </div>
  );
};

export default AuthPage;
