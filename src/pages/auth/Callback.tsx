import { Navigate, useLocation } from "react-router-dom";

export default function AuthCallback() {
  const location = useLocation();
  return <Navigate to={{ pathname: "/auth", hash: location.hash }} replace />;
}
