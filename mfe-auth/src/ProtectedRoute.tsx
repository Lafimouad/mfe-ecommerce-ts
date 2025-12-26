import React from "react";
import { useAuth } from "./useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ProtectedRoute = ({ children, fallback }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div style={{ padding: 20 }}>
        {fallback || (
          <>
            <h3>Access Denied</h3>
            <p>Please log in to access this page.</p>
          </>
        )}
      </div>
    );
  }

  return <>{children}</>;
};
