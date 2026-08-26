import { Navigate, Outlet } from "react-router-dom";
import { isCmsSuperAdmin } from "../../utils/auth";

export default function SuperAdminRoute() {
  if (!isCmsSuperAdmin()) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
}
