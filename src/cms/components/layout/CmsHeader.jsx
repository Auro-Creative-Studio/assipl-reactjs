import axios from "axios";
import {Bell, ChevronUp, LogOut, Menu, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearCmsSession, getAuthHeaders, getCmsUser } from "../../utils/auth";

const API_ROOT = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api"
).replace(/\/$/, "");

const ROLE_ENDPOINT = `${API_ROOT}/users/roles`;

const getStoredRoleName = (user) => {
  return (
    user?.role?.name ||
    user?.UserRole?.name ||
    user?.user_role?.name ||
    user?.role_name ||
    ""
  );
};

const getUserDisplayName = (user) => {
  return (
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    user?.name ||
    user?.email?.split("@")[0] ||
    "Admin"
  );
};

export default function CmsHeader({ onMenuClick }) {
  const navigate = useNavigate();
  const profileRef = useRef(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(getCmsUser());
  const displayName = getUserDisplayName(user);
  const email = user?.email || "admin@assipl.com";
  const storedRoleName = getStoredRoleName(user);
  const roleId = user?.role_id;
  const [roleName, setRoleName] = useState(storedRoleName || "No role");
  const initials = displayName
    ? displayName
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : displayName.slice(0, 1).toUpperCase();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const syncUser = () => setUser(getCmsUser());

    window.addEventListener("cms-user-updated", syncUser);
    window.addEventListener("storage", syncUser);

    return () => {
      window.removeEventListener("cms-user-updated", syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  useEffect(() => {
    if (storedRoleName) {
      setRoleName(storedRoleName);
      return;
    }

    if (!roleId) {
      setRoleName("No role");
      return;
    }

    const fetchRoleName = async () => {
      try {
        const response = await axios.get(ROLE_ENDPOINT, { headers: getAuthHeaders() });
        const roles = response.data?.data || [];
        const matchedRole = roles.find((role) => Number(role.id) === Number(roleId));
        setRoleName(matchedRole?.name || "No role");
      } catch {
        setRoleName("No role");
      }
    };

    fetchRoleName();
  }, [roleId, storedRoleName]);

  const handleLogout = () => {
    clearCmsSession();
    navigate("/admin/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <div className="flex h-20 items-center justify-between gap-4 px-5 md:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 lg:hidden"
            aria-label="Open CMS navigation"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
              Content Management
            </p>
            <h2 className="text-xl font-black text-slate-950 md:text-2xl">
              Dashboard
            </h2>
          </div>
        </div>

        <div className="hidden min-w-[280px] max-w-md flex-1 items-center rounded-xl border border-slate-200 bg-light_bg px-3 md:flex">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="search"
            placeholder="Search pages, media, users..."
            className="h-11 w-full bg-transparent px-3 text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-3">
          <button className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-light_bg">
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />
          </button>

          <div ref={profileRef} className="relative">
            <button
              type="button"
              onClick={() => setIsProfileOpen((current) => !current)}
              className="flex h-14 items-center gap-3 rounded-xl border border-slate-200 bg-white py-1.5 pl-1.5 pr-4 text-left shadow-sm transition hover:bg-light_bg"
              aria-expanded={isProfileOpen}
              aria-haspopup="menu"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-black text-white">
                {initials}
              </span>
              <span className="hidden min-w-0 sm:block">
                <span className="block max-w-36 truncate text-sm font-black leading-5 text-slate-950">
                  {displayName}
                </span>
                <span className="block text-xs font-bold leading-4 text-slate-500">
                  {roleName}
                </span>
              </span>
              <ChevronUp
                className={`h-4 w-4 text-slate-500 transition-transform ${
                  isProfileOpen ? "" : "rotate-180"
                }`}
              />
            </button>

            {isProfileOpen && (
              <div
                role="menu"
                className="absolute right-0 top-[calc(100%+10px)] z-50 w-72 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-950/10"
              >
                <div className="flex items-center gap-4 px-5 py-5">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary text-base font-black text-white">
                    {initials}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-base font-black text-slate-950">
                      {displayName}
                    </p>
                    <p className="truncate text-sm font-semibold text-slate-500">
                      {email}
                    </p>
                    <p className="mt-1 text-sm font-bold text-dark">
                      {roleName}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 border-t border-slate-100 px-5 py-4 text-left text-sm font-bold text-rose-600 transition hover:bg-rose-50"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
