import { Navigate } from "react-router-dom";
import { getToken } from "./api";

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = getToken();
  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;

  if (!token) {
    window.location.href = "http://localhost:5173/login?redirect=feedback";
    return null;
  }

  if (allowedRoles && user) {
    const roleNormalized = (user.role || "").toLowerCase();
    const isAllowed = allowedRoles.some((r) => r.toLowerCase() === roleNormalized);
    if (!isAllowed) {
      if (roleNormalized === "customer") {
        return <Navigate to="/feedback" replace />;
      }
      return <Navigate to="/management/feedback" replace />;
    }
  }

  return children;
}
