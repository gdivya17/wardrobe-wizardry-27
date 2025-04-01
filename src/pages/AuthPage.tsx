
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import { useAuth } from "@/context/AuthContext";
import { ServerCrash } from "lucide-react";

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
        {/* API URL Info for debugging */}
        <div className="mb-4 text-xs text-muted-foreground text-center">
          <p>API: {import.meta.env.VITE_API_URL || "http://localhost:8000"}</p>
        </div>

        {isLoginForm ? (
          <LoginForm onToggleForm={() => setIsLoginForm(false)} />
        ) : (
          <RegisterForm onToggleForm={() => setIsLoginForm(true)} />
        )}
        
        <div className="mt-6 pt-4 border-t text-center text-sm text-muted-foreground">
          <p className="flex justify-center items-center gap-1">
            <ServerCrash className="h-4 w-4" />
            <span>Having trouble connecting?</span>
          </p>
          <p>Make sure the Python backend is running at: {import.meta.env.VITE_API_URL || "http://localhost:8000"}</p>
          <p className="mt-1">If port 8000 is already in use, try running the backend on a different port:</p>
          <pre className="mt-1 text-xs bg-gray-100 p-2 rounded">uvicorn app.main:app --reload --port 8001</pre>
          <p className="mt-1">Then set the environment variable before starting the frontend:</p>
          <pre className="text-xs bg-gray-100 p-2 rounded">export VITE_API_URL=http://localhost:8001</pre>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
