import axios from "axios";
import { Bell, Check, ChevronUp, ExternalLink, LogOut, Menu, RefreshCw, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearCmsSession, getAuthHeaders, getCmsUser, isCmsSuperAdmin } from "../../utils/auth";
import { navItems } from "./cmsNavItems";

const API_ROOT = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api"
).replace(/\/$/, "");

const ROLE_ENDPOINT = `${API_ROOT}/users/roles`;
const CONTACT_ENDPOINT = `${API_ROOT}/contacts`;
const ENQUIRY_ENDPOINT = `${API_ROOT}/enquiries`;
const APPLICATION_ENDPOINT = `${API_ROOT}/career-forms`;
const NEWSLETTER_ENDPOINT = `${API_ROOT}/newsletter-subscribers`;
const READ_NOTIFICATIONS_KEY = "assipl_cms_read_notifications";

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

const getReadNotificationIds = () => {
  try {
    return new Set(JSON.parse(localStorage.getItem(READ_NOTIFICATIONS_KEY) || "[]"));
  } catch {
    return new Set();
  }
};

const storeReadNotificationIds = (ids) => {
  try {
    localStorage.setItem(READ_NOTIFICATIONS_KEY, JSON.stringify(Array.from(ids)));
  } catch {
    // Read state is only a UI convenience.
  }
};

const formatNotificationDate = (value) => {
  if (!value) return "N/A";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const flattenSearchItems = (items, user) =>
  items
    .filter((item) => !item.superAdminOnly || isCmsSuperAdmin(user))
    .flatMap((item) => {
      if (!item.children) {
        return [
          {
            label: item.label,
            group: "CMS",
            href: item.href,
            keywords: [item.label, item.href],
            icon: item.icon,
          },
        ];
      }

      return item.children.map((child) => ({
        label: child.label,
        group: item.label,
        href: child.href,
        keywords: [child.label, item.label, child.href],
        icon: item.icon,
      }));
    });

const getFullName = (item) =>
  [item?.first_name, item?.last_name].filter(Boolean).join(" ") ||
  item?.full_name ||
  item?.name ||
  "Visitor";

const createNotification = ({ id, title, message, createdAt, href, type }) => ({
  id: `${type}-${id}`,
  title,
  message,
  createdAt,
  href,
  initial: title.slice(4, 5).toUpperCase() || "N",
});

const normalizeNotifications = ({ contacts = [], enquiries = [], applications = [], subscribers = [] }) => [
  ...contacts.map((contact) =>
    createNotification({
      id: contact.id,
      type: "contact",
      title: "New contact form submission",
      message: `${getFullName(contact)} submitted: ${contact.subject || contact.message || "Contact request"}`,
      createdAt: contact.created_at || contact.updated_at,
      href: "/admin/contacts",
    })
  ),
  ...enquiries.map((enquiry) =>
    createNotification({
      id: enquiry.id,
      type: "enquiry",
      title: "New enquiry submission",
      message: `${getFullName(enquiry)} requested: ${enquiry.service_needed || "Service enquiry"}`,
      createdAt: enquiry.created_at || enquiry.updated_at,
      href: "/admin/enquiries",
    })
  ),
  ...applications.map((application) =>
    createNotification({
      id: application.id,
      type: "career",
      title: "New career application submission",
      message: `${getFullName(application)} applied for ${application.position?.position_name || "a position"}`,
      createdAt: application.created_at || application.updated_at,
      href: "/admin/career-applications",
    })
  ),
  ...subscribers.map((subscriber) =>
    createNotification({
      id: subscriber.id,
      type: "newsletter",
      title: "New newsletter subscription",
      message: `${subscriber.email || "New visitor"} subscribed to updates`,
      createdAt: subscriber.created_at || subscriber.createdAt || subscriber.updated_at,
      href: "/admin/newsletter-subscribers",
    })
  ),
]
  .filter((item) => item.id && item.createdAt)
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  .slice(0, 6);

export default function CmsHeader({ onMenuClick }) {
  const navigate = useNavigate();
  const profileRef = useRef(null);
  const searchRef = useRef(null);
  const notificationRef = useRef(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isNotificationsLoading, setIsNotificationsLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [readNotificationIds, setReadNotificationIds] = useState(getReadNotificationIds);
  const [searchQuery, setSearchQuery] = useState("");
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

  const unreadCount = notifications.filter(
    (notification) => !readNotificationIds.has(notification.id)
  ).length;
  const searchItems = useMemo(() => flattenSearchItems(navItems, user), [user]);
  const filteredSearchItems = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) return searchItems.slice(0, 6);

    return searchItems
      .filter((item) =>
        item.keywords.some((keyword) =>
          String(keyword).toLowerCase().includes(normalizedQuery)
        )
      )
      .slice(0, 8);
  }, [searchItems, searchQuery]);

  const fetchNotifications = async () => {
    setIsNotificationsLoading(true);

    try {
      const [contactsResponse, enquiriesResponse, applicationsResponse, subscribersResponse] = await Promise.allSettled([
        axios.get(CONTACT_ENDPOINT, { headers: getAuthHeaders() }),
        axios.get(ENQUIRY_ENDPOINT, { headers: getAuthHeaders() }),
        axios.get(APPLICATION_ENDPOINT, { headers: getAuthHeaders() }),
        axios.get(NEWSLETTER_ENDPOINT, { headers: getAuthHeaders() }),
      ]);

      setNotifications(
        normalizeNotifications({
          contacts: contactsResponse.status === "fulfilled" ? contactsResponse.value.data?.data || [] : [],
          enquiries: enquiriesResponse.status === "fulfilled" ? enquiriesResponse.value.data?.data || [] : [],
          applications: applicationsResponse.status === "fulfilled" ? applicationsResponse.value.data?.data || [] : [],
          subscribers: subscribersResponse.status === "fulfilled" ? subscribersResponse.value.data?.data || [] : [],
        })
      );
    } finally {
      setIsNotificationsLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }

      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }

      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
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
    fetchNotifications();
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

  const openSearchItem = (item) => {
    if (!item?.href) return;

    navigate(item.href);
    setSearchQuery("");
    setIsSearchOpen(false);
  };

  const openNotification = (notification) => {
    const nextReadIds = new Set(readNotificationIds);
    nextReadIds.add(notification.id);
    setReadNotificationIds(nextReadIds);
    storeReadNotificationIds(nextReadIds);
    setIsNotificationOpen(false);
    navigate(notification.href);
  };

  const markAllNotificationsRead = () => {
    const nextReadIds = new Set([
      ...readNotificationIds,
      ...notifications.map((notification) => notification.id),
    ]);
    setReadNotificationIds(nextReadIds);
    storeReadNotificationIds(nextReadIds);
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      openSearchItem(filteredSearchItems[0]);
    }

    if (event.key === "Escape") {
      setIsSearchOpen(false);
    }
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

        <div ref={searchRef} className="relative hidden min-w-[280px] max-w-md flex-1 md:block">
          <div className="flex items-center rounded-xl border border-slate-200 bg-light_bg px-3 transition focus-within:border-primary focus-within:bg-white focus-within:ring-4 focus-within:ring-primary/10">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search pages, media, users..."
              className="h-11 w-full bg-transparent px-3 text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400"
              aria-label="Search CMS pages"
              aria-expanded={isSearchOpen}
            />
          </div>

          {isSearchOpen && (
            <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-50 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-950/10">
              {filteredSearchItems.length > 0 ? (
                <div className="max-h-80 overflow-y-auto p-2">
                  {filteredSearchItems.map((item) => {
                    const Icon = item.icon;

                    return (
                      <button
                        key={`${item.group}-${item.href}`}
                        type="button"
                        onClick={() => openSearchItem(item)}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition hover:bg-slate-100"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-black text-slate-900">
                            {item.label}
                          </span>
                          <span className="block truncate text-xs font-bold text-slate-400">
                            {item.group}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="px-4 py-5 text-sm font-bold text-slate-500">
                  No matching CMS page found.
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => window.open("/", "_blank", "noopener,noreferrer")}
            className="hidden h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 transition hover:bg-light_bg md:inline-flex"
          >
            <ExternalLink className="h-4 w-4" />
            Visit Site
          </button>

          <div ref={notificationRef} className="relative">
            <button
              type="button"
              onClick={() => setIsNotificationOpen((current) => !current)}
              className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-light_bg"
              aria-label="Open notifications"
              aria-expanded={isNotificationOpen}
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[11px] font-black leading-none text-white ring-2 ring-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {isNotificationOpen && (
              <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-[calc(100vw-32px)] max-w-96 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-950/10">
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
                  <div>
                    <h3 className="text-base font-black leading-6 text-slate-950">Notifications</h3>
                    <p className="text-xs font-bold text-slate-500">
                      {unreadCount} unread
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={markAllNotificationsRead}
                    disabled={notifications.length === 0}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-fuchsia-700 transition hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Check className="h-3.5 w-3.5" />
                    Read all
                  </button>
                </div>

                <div className="max-h-[330px] overflow-y-auto">
                  {isNotificationsLoading && notifications.length === 0 ? (
                    <p className="px-5 py-7 text-sm font-bold text-slate-500">Loading notifications...</p>
                  ) : notifications.length > 0 ? (
                    notifications.map((notification) => {
                      const isUnread = !readNotificationIds.has(notification.id);

                      return (
                        <button
                          key={notification.id}
                          type="button"
                          onClick={() => openNotification(notification)}
                          className="relative flex w-full gap-3 border-b border-slate-100 px-5 py-4 text-left transition hover:bg-slate-50"
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-fuchsia-50 text-sm font-black text-fuchsia-700">
                            {notification.initial}
                          </span>
                          <span className="min-w-0 flex-1 pr-5">
                            <span className="block truncate text-sm font-black leading-5 text-slate-950">
                              {notification.title}
                            </span>
                            <span className="block truncate text-xs font-bold leading-5 text-slate-600">
                              {notification.message}
                            </span>
                            <span className="mt-1 block text-xs font-black text-slate-400">
                              {formatNotificationDate(notification.createdAt)}
                            </span>
                          </span>
                          {isUnread && (
                            <span className="absolute right-5 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-emerald-500" />
                          )}
                        </button>
                      );
                    })
                  ) : (
                    <p className="px-5 py-7 text-sm font-bold text-slate-500">No notifications found.</p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={fetchNotifications}
                  disabled={isNotificationsLoading}
                  className="flex w-full items-center justify-center gap-2 bg-slate-50 px-5 py-4 text-sm font-bold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <RefreshCw className={`h-4 w-4 ${isNotificationsLoading ? "animate-spin" : ""}`} />
                  Refresh notifications
                </button>
              </div>
            )}
          </div>

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
