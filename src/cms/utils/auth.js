const TOKEN_KEY = "assipl_cms_token";
const USER_KEY = "assipl_cms_user";

const parseJwt = (token) => {
  try {
    const payload = token.split(".")[1] || "";
    const normalizedPayload = payload
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(payload.length / 4) * 4, "=");

    return JSON.parse(atob(normalizedPayload));
  } catch {
    return null;
  }
};

export const getCmsToken = () => localStorage.getItem(TOKEN_KEY);

export const getCmsUser = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || "null");
  } catch {
    return null;
  }
};

export const setCmsSession = ({ token, user }) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user || null));
};

export const clearCmsSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const isCmsAuthenticated = () => {
  const token = getCmsToken();

  if (!token) return false;

  const decodedToken = parseJwt(token);

  if (!decodedToken?.exp) return true;

  return decodedToken.exp * 1000 > Date.now();
};

export const getAuthHeaders = () => {
  const token = getCmsToken();

  return token ? { Authorization: `Bearer ${token}` } : {};
};

const normalizeRoleValue = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

export const getCmsUserRoleValues = (user = getCmsUser()) => {
  return [
    user?.role?.name,
    user?.role?.type,
    user?.UserRole?.name,
    user?.UserRole?.type,
    user?.user_role?.name,
    user?.user_role?.type,
    user?.role_name,
    user?.role_type,
  ]
    .map(normalizeRoleValue)
    .filter(Boolean);
};

export const isCmsSuperAdmin = (user = getCmsUser()) => {
  return getCmsUserRoleValues(user).some((roleValue) =>
    ["super_admin", "superadmin"].includes(roleValue)
  );
};
