const API_ROOT = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api"
).replace(/\/$/, "");

export const ABOUT_ENDPOINT = `${API_ROOT}/about`;

const BACKEND_ORIGIN = API_ROOT.replace(/\/api$/, "");
const createItemId = () => `item-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export const toAboutUploadPath = (value = "") => {
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

export const createAboutLogo = () => ({ id: createItemId(), logo: "" });
export const createAboutFeature = () => ({ id: createItemId(), logo: "", description: "" });

const normalizeLogos = (items) => {
  if (!Array.isArray(items)) return [];

  return items
    .slice()
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((item) => ({
      id: item.id || createItemId(),
      logo: item.logo || "",
    }));
};

const normalizeFeatures = (items) => {
  if (!Array.isArray(items)) return [];

  return items
    .slice()
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((item) => ({
      id: item.id || createItemId(),
      logo: item.logo || "",
      description: item.description || "",
    }));
};

export const createBlankAboutForm = () => ({
  id: null,
  banner_image: "",
  banner_title: "",
  banner_description: "",
  about_image: "",
  about_title: "",
  about_description: "",
  download_brochure: "",
  manufacture_title: "",
  securing_title: "",
  securing_description: "",
  securing_image: "",
  securing_image_2: "",
  securing_image_3: "",
  future_title: "",
  future_description: "",
  future_image: "",
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
  logos: [],
  features: [],
  created_at: "",
  updated_at: "",
});

export const normalizeAbout = (about = {}) => ({
  id: about.id ?? null,
  banner_image: about.banner_image || "",
  banner_title: about.banner_title || "",
  banner_description: about.banner_description || "",
  about_image: about.about_image || "",
  about_title: about.about_title || "",
  about_description: about.about_description || "",
  download_brochure: about.download_brochure || "",
  manufacture_title: about.manufacture_title || "",
  securing_title: about.securing_title || "",
  securing_description: about.securing_description || "",
  securing_image: about.securing_image || "",
  securing_image_2: about.securing_image_2 || "",
  securing_image_3: about.securing_image_3 || "",
  future_title: about.future_title || "",
  future_description: about.future_description || "",
  future_image: about.future_image || "",
  meta_title: about.meta_title || "",
  meta_description: about.meta_description || "",
  meta_keywords: about.meta_keywords || "",
  og_title: about.og_title || "",
  og_description: about.og_description || "",
  og_image: about.og_image || "",
  image_alt_text: about.image_alt_text || "",
  robots_index: about.robots_index || "index",
  robots_follow: about.robots_follow || "follow",
  published: about.published === undefined ? true : Boolean(about.published),
  logos: normalizeLogos(about.logos),
  features: normalizeFeatures(about.features),
  created_at: about.created_at || "",
  updated_at: about.updated_at || "",
});

export const getResponseRecord = (responseData) => {
  const data = responseData?.data ?? responseData;
  if (Array.isArray(data)) return data[0] || null;
  return data || null;
};

export const buildAboutPayload = (formData, toUploadPath) => ({
  banner_image: toUploadPath(formData.banner_image) || null,
  banner_title: formData.banner_title.trim() || null,
  banner_description: formData.banner_description.trim() || null,
  about_image: toUploadPath(formData.about_image) || null,
  about_title: formData.about_title.trim() || null,
  about_description: formData.about_description.trim() || null,
  download_brochure: toUploadPath(formData.download_brochure) || null,
  manufacture_title: formData.manufacture_title.trim() || null,
  securing_title: formData.securing_title.trim() || null,
  securing_description: formData.securing_description.trim() || null,
  securing_image: toUploadPath(formData.securing_image) || null,
  securing_image_2: toUploadPath(formData.securing_image_2) || null,
  securing_image_3: toUploadPath(formData.securing_image_3) || null,
  future_title: formData.future_title.trim() || null,
  future_description: formData.future_description.trim() || null,
  future_image: toUploadPath(formData.future_image) || null,
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
  logos: formData.logos.map((item, index) => ({
    logo: toUploadPath(item.logo) || null,
    sort_order: index,
  })),
  features: formData.features.map((item, index) => ({
    logo: toUploadPath(item.logo) || null,
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
