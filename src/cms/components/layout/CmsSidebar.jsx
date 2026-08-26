import {
  Briefcase,
  ChevronDown,
  Cookie,
  Inbox,
  Image,
  Layers,
  LayoutDashboard,
  MessageSquareText,
  Mail,
  Newspaper,
  SearchCode,
  Wrench,
  X,
  UserCircle,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { getCmsUser, isCmsSuperAdmin } from "../../utils/auth";
import logo from "../../../assets/logo.webp";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Enquiries", href: "/admin/enquiries", icon: MessageSquareText },
  { label: "Contacts", href: "/admin/contacts", icon: Inbox },
  { label: "Newsletter", href: "/admin/newsletter-subscribers", icon: Mail },
  { label: "SEO Pages", href: "/admin/seo", icon: SearchCode },
  { label: "Blogs", href: "/admin/blogs", icon: Newspaper },
  { label: "Products", href: "/admin/products", icon: Layers },
  { label: "Services", href: "/admin/single-services", icon: Wrench },
  {
    label: "Careers",
    basePath: "/admin/career",
    icon: Briefcase,
    children: [
      { label: "Positions", href: "/admin/career-positions" },
      { label: "Applications", href: "/admin/career-applications" },
    ],
  },
  { label: "Cookie Consents", href: "/admin/cookie-consents", icon: Cookie },
  { label: "Media", href: "/admin/media", icon: Image },
  // { label: "Projects", href: "/admin/projects", icon: FolderKanban },
  // { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Users", href: "/admin/users", icon: Users, superAdminOnly: true },
  // { label: "Settings", href: "/admin/settings", icon: Settings },
];

const getUserDisplayName = (user) => {
  return (
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    user?.name ||
    user?.email?.split("@")[0] ||
    "CMS User"
  );
};

const isSectionActive = (item, pathname) =>
  pathname.startsWith(item.basePath) ||
  (item.children || []).some((child) => pathname.startsWith(child.href));

export default function CmsSidebar({ isOpen = false, onClose }) {
  const location = useLocation();
  const [user, setUser] = useState(getCmsUser());
  const [expandedMenus, setExpandedMenus] = useState(() =>
    navItems.reduce((acc, item) => {
      if (item.children) {
        acc[item.label] = isSectionActive(item, location.pathname);
      }
      return acc;
    }, {})
  );
  const [trackedPathname, setTrackedPathname] = useState(location.pathname);

  const visibleNavItems = navItems.filter(
    (item) => !item.superAdminOnly || isCmsSuperAdmin(user)
  );
  const displayName = getUserDisplayName(user);
  const email = user?.email || "No email";
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (location.pathname !== trackedPathname) {
    setTrackedPathname(location.pathname);
    setExpandedMenus((current) => {
      const next = { ...current };
      let changed = false;

      navItems.forEach((item) => {
        if (item.children && isSectionActive(item, location.pathname) && !next[item.label]) {
          next[item.label] = true;
          changed = true;
        }
      });

      return changed ? next : current;
    });
  }

  useEffect(() => {
    const syncUser = () => setUser(getCmsUser());

    window.addEventListener("cms-user-updated", syncUser);
    window.addEventListener("storage", syncUser);

    return () => {
      window.removeEventListener("cms-user-updated", syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-950/40 transition-opacity lg:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white px-4 py-5 shadow-2xl shadow-slate-950/15 transition-transform duration-200 lg:z-40 lg:translate-x-0 lg:shadow-none ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-3 px-2">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl text-white">
              <img
                src={logo}
                alt="Assipl Logo"
                className="h-11 w-11 object-contain"
              />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-400">
                Assipl
              </p>
              <h1 className="text-xl font-black leading-none text-slate-950">
                CMS Panel
              </h1>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100 lg:hidden"
            aria-label="Close CMS navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="scrollbar-hide mt-9 flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto overscroll-contain pr-1">
          {visibleNavItems.map((item) => {
            if (item.children) {
              const isParentActive = item.children.some(
                (child) =>
                  location.pathname === child.href ||
                  location.pathname.startsWith(`${child.href}/`)
              );
              const isExpanded = Boolean(expandedMenus[item.label]);
              const submenuId = `cms-${item.label.toLowerCase().replace(/\s+/g, "-")}-submenu`;

              return (
                <div key={item.label} className="grid gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedMenus((current) => ({
                        ...current,
                        [item.label]: !current[item.label],
                      }))
                    }
                    className={`flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm font-bold transition ${
                      isParentActive
                        ? "bg-primary text-white shadow-sm shadow-slate-950/20"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                    }`}
                    aria-expanded={isExpanded}
                    aria-controls={submenuId}
                  >
                    <span className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <div id={submenuId} className="ml-4 grid gap-1 border-l border-slate-200 pl-3">
                      {item.children.map((child) => (
                        <NavLink
                          key={child.href}
                          to={child.href}
                          onClick={onClose}
                          className={({ isActive }) =>
                            `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                              isActive
                                ? "bg-slate-950 text-white shadow-sm shadow-slate-950/20"
                                : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                            }`
                          }
                        >
                          <span className="h-2 w-2 rounded-full bg-current opacity-70" />
                          {child.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            const Icon = item.icon;

            return (
              <NavLink
                key={item.label}
                to={item.href}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition ${
                    isActive
                      ? "bg-primary text-white shadow-sm shadow-slate-950/20"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="rounded-xl border border-slate-200 bg-light_bg p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-black text-white">
              {initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-black text-slate-950">
                {displayName}
              </p>
              <p className="truncate text-xs font-semibold text-slate-500">
                {email}
              </p>
            </div>
          </div>
          <Link
            to="/admin/profile"
            onClick={onClose}
            className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-white text-sm font-black text-slate-700 ring-1 ring-inset ring-slate-200 transition hover:bg-slate-950 hover:text-white"
          >
            <UserCircle className="h-4 w-4" />
            View Profile
          </Link>
        </div>
      </aside>
    </>
  );
}
