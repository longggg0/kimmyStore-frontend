import { Navigate } from "react-router-dom";

export const AdminProtectRoute = ({ children }: any) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};