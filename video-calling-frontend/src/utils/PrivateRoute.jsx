import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      console.log("Checking auth...");
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER}/api/auth/check`,
          {
            credentials: "include",
          }
        );
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
