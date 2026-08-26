import { Navigate, Outlet, useLocation } from "react-router-dom";
import { clearCmsSession, isCmsAuthenticated } from "../../utils/auth";

export default function ProtectedCmsRoute() {
  const location = useLocation();

  if (!isCmsAuthenticated()) {
    clearCmsSession();
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
