const API_ROOT = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api"
).replace(/\/$/, "");

export const SERVICES_PAGE_ENDPOINT = `${API_ROOT}/services-page`;

const BACKEND_ORIGIN = (import.meta.env.VITE_MEDIA_BASE_URL || API_ROOT.replace(/\/api$/, "")).replace(/\/$/, "");
const createItemId = () => `item-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export const toServicesPageUploadPath = (value = "") => {
  const textValue = String(value || "").trim();
  if (!textValue) return "";

  if (textValue.startsWith("/src/") || textValue.startsWith("/assets/")) {
    return textValue;
  }

  const cleanUploadPath = (path) => path.replace(/^\/+/, "").replace(/^api\/uploads\//, "uploads/");

  try {
    const url = new URL(textValue);

    if (url.origin !== BACKEND_ORIGIN) {
      return textValue;
    }

    return cleanUploadPath(url.pathname);
  } catch {
    return cleanUploadPath(textValue);
  }
};

export const createStrategicItem = () => ({ id: createItemId(), icon: "", heading: "", description: "" });
export const createCoreProjectItem = () => ({ id: createItemId(), icon: "", heading: "", description: "" });
export const createMaintenanceItem = () => ({ id: createItemId(), image: "", heading: "", description: "" });

const normalizeIconItems = (items) => {
  if (!Array.isArray(items)) return [];

  return items
    .slice()
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((item) => ({
      id: item.id || createItemId(),
      icon: item.icon || "",
      heading: item.heading || "",
      description: item.description || "",
    }));
};

const normalizeMaintenanceItems = (items) => {
  if (!Array.isArray(items)) return [];

  return items
    .slice()
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((item) => ({
      id: item.id || createItemId(),
      image: item.image || "",
      heading: item.heading || "",
      description: item.description || "",
    }));
};

export const createBlankServicesPageForm = () => ({
  id: null,
  banner_image: "",
  services_title: "",
  services_description: "",
  strategic_image: "",
  strategic_title: "",
  core_project_title: "",
  core_project_description: "",
  maintenance_title: "",
  learn_more_link: "",
  know_more_link: "",
  read_more_link: "",
  meta_title: "",
  meta_description: "",
  meta_keywords: "",
  og_title: "",
  og_description: "",
  og_image: "",
  image_alt_text: "",
  robots_index: "index",
  robots_follow: "follow",
  published: true,
  strategic_items: [],
  core_projects: [],
  maintenance_items: [],
  created_at: "",
  updated_at: "",
});

export const normalizeServicesPage = (page = {}) => ({
  id: page.id ?? null,
  banner_image: page.banner_image || "",
  services_title: page.services_title || "",
  services_description: page.services_description || "",
  strategic_image: page.strategic_image || "",
  strategic_title: page.strategic_title || "",
  core_project_title: page.core_project_title || "",
  core_project_description: page.core_project_description || "",
  maintenance_title: page.maintenance_title || "",
  learn_more_link: page.learn_more_link || "",
  know_more_link: page.know_more_link || "",
  read_more_link: page.read_more_link || "",
  meta_title: page.meta_title || "",
  meta_description: page.meta_description || "",
  meta_keywords: page.meta_keywords || "",
  og_title: page.og_title || "",
  og_description: page.og_description || "",
  og_image: page.og_image || "",
  image_alt_text: page.image_alt_text || "",
  robots_index: page.robots_index || "index",
  robots_follow: page.robots_follow || "follow",
  published: page.published === undefined ? true : Boolean(page.published),
  strategic_items: normalizeIconItems(page.strategic_items),
  core_projects: normalizeIconItems(page.core_projects),
  maintenance_items: normalizeMaintenanceItems(page.maintenance_items),
  created_at: page.created_at || "",
  updated_at: page.updated_at || "",
});

export const getResponseRecord = (responseData) => {
  const data = responseData?.data ?? responseData;
  if (Array.isArray(data)) return data[0] || null;
  return data || null;
};

export const buildServicesPagePayload = (formData, toUploadPath) => ({
  banner_image: toUploadPath(formData.banner_image) || null,
  services_title: formData.services_title.trim() || null,
  services_description: formData.services_description.trim() || null,
  strategic_image: toUploadPath(formData.strategic_image) || null,
  strategic_title: formData.strategic_title.trim() || null,
  core_project_title: formData.core_project_title.trim() || null,
  core_project_description: formData.core_project_description.trim() || null,
  maintenance_title: formData.maintenance_title.trim() || null,
  learn_more_link: formData.learn_more_link.trim() || null,
  know_more_link: formData.know_more_link.trim() || null,
  read_more_link: formData.read_more_link.trim() || null,
  meta_title: formData.meta_title.trim() || null,
  meta_description: formData.meta_description.trim() || null,
  meta_keywords: formData.meta_keywords.trim() || null,
  og_title: formData.og_title.trim() || null,
  og_description: formData.og_description.trim() || null,
  og_image: toUploadPath(formData.og_image) || null,
  image_alt_text: formData.image_alt_text.trim() || null,
  robots_index: formData.robots_index,
  robots_follow: formData.robots_follow,
  published: formData.published,
  strategic_items: formData.strategic_items.map((item, index) => ({
    icon: toUploadPath(item.icon) || null,
    heading: item.heading.trim(),
    description: item.description.trim(),
    sort_order: index,
  })),
  core_projects: formData.core_projects.map((item, index) => ({
    icon: toUploadPath(item.icon) || null,
    heading: item.heading.trim(),
    description: item.description.trim(),
    sort_order: index,
  })),
  maintenance_items: formData.maintenance_items.map((item, index) => ({
    image: toUploadPath(item.image) || null,
    heading: item.heading.trim(),
    description: item.description.trim(),
    sort_order: index,
  })),
});

export const formatDate = (value) => {
  if (!value) return "N/A";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
};
