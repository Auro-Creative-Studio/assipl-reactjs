const API_ROOT = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api"
).replace(/\/$/, "");

export const HOME_ENDPOINT = `${API_ROOT}/home`;

export const createItemId = () => `item-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export const createStatItem = () => ({ id: createItemId(), value: "" });
export const createLogoItem = () => ({ id: createItemId(), image: "", alt: "" });
export const createTestimonialItem = () => ({ id: createItemId(), quote: "", company: "", logo: "" });
export const createClientLogoItem = () => ({ id: createItemId(), name: "", logo: "" });
export const createServiceItem = () => ({ id: createItemId(), title: "", description: "" });
export const createLocationItem = () => ({ id: createItemId(), name: "", lon: "", lat: "", hq: false });

const normalizeStats = (items) => {
  if (!Array.isArray(items)) return [];
  return items.map((item) =>
    typeof item === "string"
      ? { id: createItemId(), value: item }
      : { id: item.id || createItemId(), value: item.value || "" }
  );
};

const normalizeLogos = (items) => {
  if (!Array.isArray(items)) return [];
  return items.map((item) => ({
    id: item.id || createItemId(),
    image: item.image || "",
    alt: item.alt || "",
  }));
};

const normalizeTestimonials = (items) => {
  if (!Array.isArray(items)) return [];
  return items.map((item) => ({
    id: item.id || createItemId(),
    quote: item.quote || "",
    company: item.company || "",
    logo: item.logo || "",
  }));
};

const normalizeClientLogos = (items) => {
  if (!Array.isArray(items)) return [];
  return items.map((item) => ({
    id: item.id || createItemId(),
    name: item.name || "",
    logo: item.logo || "",
  }));
};

const normalizeServices = (items) => {
  if (!Array.isArray(items)) return [];
  return items.map((item) => ({
    id: item.id || createItemId(),
    title: item.title || "",
    description: item.description || "",
  }));
};

const normalizeLocations = (items) => {
  if (!Array.isArray(items)) return [];
  return items.map((item) => ({
    id: item.id || createItemId(),
    name: item.name || "",
    lon: item.lon ?? "",
    lat: item.lat ?? "",
    hq: Boolean(item.hq),
  }));
};

export const createBlankHomeForm = () => ({
  id: null,
  hero_background_image: "",
  hero_title_line1: "",
  hero_title_line2: "",
  hero_subtitle: "",
  hero_stats: [],
  hero_cta_label: "",
  partners_heading: "",
  partners_logos: [],
  about_image: "",
  about_heading: "",
  about_description: "",
  about_cta_label: "",
  about_cta_href: "",
  video_url: "",
  clients_heading: "",
  testimonials: [],
  client_logos: [],
  services_heading: "",
  services_description: "",
  services_image: "",
  services: [],
  services_cta_label: "",
  services_cta_href: "",
  nationwide_heading: "",
  nationwide_description: "",
  locations: [],
  audit_heading: "",
  audit_description: "",
  audit_background_image: "",
  meta_title: "",
  meta_description: "",
  meta_keywords: "",
  og_title: "",
  og_description: "",
  og_image: "",
  image_alt_text: "",
  robots_index: "index",
  robots_follow: "follow",
  status: true,
  created_at: "",
  updated_at: "",
});

export const normalizeHome = (home = {}) => ({
  id: home.id ?? null,
  hero_background_image: home.hero_background_image || "",
  hero_title_line1: home.hero_title_line1 || "",
  hero_title_line2: home.hero_title_line2 || "",
  hero_subtitle: home.hero_subtitle || "",
  hero_stats: normalizeStats(home.hero_stats),
  hero_cta_label: home.hero_cta_label || "",
  partners_heading: home.partners_heading || "",
  partners_logos: normalizeLogos(home.partners_logos),
  about_image: home.about_image || "",
  about_heading: home.about_heading || "",
  about_description: home.about_description || "",
  about_cta_label: home.about_cta_label || "",
  about_cta_href: home.about_cta_href || "",
  video_url: home.video_url || "",
  clients_heading: home.clients_heading || "",
  testimonials: normalizeTestimonials(home.testimonials),
  client_logos: normalizeClientLogos(home.client_logos),
  services_heading: home.services_heading || "",
  services_description: home.services_description || "",
  services_image: home.services_image || "",
  services: normalizeServices(home.services),
  services_cta_label: home.services_cta_label || "",
  services_cta_href: home.services_cta_href || "",
  nationwide_heading: home.nationwide_heading || "",
  nationwide_description: home.nationwide_description || "",
  locations: normalizeLocations(home.locations),
  audit_heading: home.audit_heading || "",
  audit_description: home.audit_description || "",
  audit_background_image: home.audit_background_image || "",
  meta_title: home.meta_title || "",
  meta_description: home.meta_description || "",
  meta_keywords: home.meta_keywords || "",
  og_title: home.og_title || "",
  og_description: home.og_description || "",
  og_image: home.og_image || "",
  image_alt_text: home.image_alt_text || "",
  robots_index: home.robots_index || "index",
  robots_follow: home.robots_follow || "follow",
  status: home.status === undefined ? true : Boolean(home.status),
  created_at: home.created_at || "",
  updated_at: home.updated_at || "",
});

export const getResponseRecord = (responseData) => {
  const data = responseData?.data ?? responseData;
  if (Array.isArray(data)) return data[0] || null;
  return data || null;
};

const stripId = (item) => {
  const rest = { ...item };
  delete rest.id;
  return rest;
};

export const buildHomePayload = (formData, toUploadPath) => ({
  hero_background_image: toUploadPath(formData.hero_background_image) || null,
  hero_title_line1: formData.hero_title_line1.trim() || null,
  hero_title_line2: formData.hero_title_line2.trim() || null,
  hero_subtitle: formData.hero_subtitle.trim() || null,
  hero_stats: formData.hero_stats.map((item) => item.value).filter(Boolean),
  hero_cta_label: formData.hero_cta_label.trim() || null,
  partners_heading: formData.partners_heading.trim() || null,
  partners_logos: formData.partners_logos.map((item) => ({
    ...stripId(item),
    image: toUploadPath(item.image) || null,
  })),
  about_image: toUploadPath(formData.about_image) || null,
  about_heading: formData.about_heading.trim() || null,
  about_description: formData.about_description.trim() || null,
  about_cta_label: formData.about_cta_label.trim() || null,
  about_cta_href: formData.about_cta_href.trim() || null,
  video_url: toUploadPath(formData.video_url) || null,
  clients_heading: formData.clients_heading.trim() || null,
  testimonials: formData.testimonials.map((item) => ({
    ...stripId(item),
    logo: toUploadPath(item.logo) || null,
  })),
  client_logos: formData.client_logos.map((item) => ({
    ...stripId(item),
    logo: toUploadPath(item.logo) || null,
  })),
  services_heading: formData.services_heading.trim() || null,
  services_description: formData.services_description.trim() || null,
  services_image: toUploadPath(formData.services_image) || null,
  services: formData.services.map((item) => stripId(item)),
  services_cta_label: formData.services_cta_label.trim() || null,
  services_cta_href: formData.services_cta_href.trim() || null,
  nationwide_heading: formData.nationwide_heading.trim() || null,
  nationwide_description: formData.nationwide_description.trim() || null,
  locations: formData.locations.map((item) => ({
    ...stripId(item),
    lon: item.lon === "" ? null : Number(item.lon),
    lat: item.lat === "" ? null : Number(item.lat),
  })),
  audit_heading: formData.audit_heading.trim() || null,
  audit_description: formData.audit_description.trim() || null,
  audit_background_image: toUploadPath(formData.audit_background_image) || null,
  meta_title: formData.meta_title.trim() || null,
  meta_description: formData.meta_description.trim() || null,
  meta_keywords: formData.meta_keywords.trim() || null,
  og_title: formData.og_title.trim() || null,
  og_description: formData.og_description.trim() || null,
  og_image: toUploadPath(formData.og_image) || null,
  image_alt_text: formData.image_alt_text.trim() || null,
  robots_index: formData.robots_index,
  robots_follow: formData.robots_follow,
  status: formData.status,
});

export const formatDate = (value) => {
  if (!value) return "N/A";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
};
