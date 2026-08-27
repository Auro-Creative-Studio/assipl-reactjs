const API_ROOT = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api"
).replace(/\/$/, "");

export const CSR_ENDPOINT = `${API_ROOT}/csr`;

const createItemId = () => `item-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export const createCsrImage = () => ({ id: createItemId(), image: "", status: true });

const normalizeImages = (items) => {
  if (!Array.isArray(items)) return [];

  return items
    .slice()
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((item) => ({
      id: item.id || createItemId(),
      image: item.image || "",
      status: item.status === undefined ? true : Boolean(item.status),
    }));
};

export const createBlankCsrForm = () => ({
  id: null,
  banner_image: "",
  intro_title: "",
  intro_description: "",
  project_title: "",
  project_description: "",
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
  published: true,
  intro_images: [],
  slider_images: [],
  created_at: "",
  updated_at: "",
});

export const normalizeCsr = (csr = {}) => ({
  id: csr.id ?? null,
  banner_image: csr.banner_image || "",
  intro_title: csr.intro_title || "",
  intro_description: csr.intro_description || "",
  project_title: csr.project_title || "",
  project_description: csr.project_description || "",
  meta_title: csr.meta_title || "",
  meta_description: csr.meta_description || "",
  meta_keywords: csr.meta_keywords || "",
  og_title: csr.og_title || "",
  og_description: csr.og_description || "",
  og_image: csr.og_image || "",
  image_alt_text: csr.image_alt_text || "",
  robots_index: csr.robots_index || "index",
  robots_follow: csr.robots_follow || "follow",
  status: csr.status === undefined ? true : Boolean(csr.status),
  published: csr.published === undefined ? true : Boolean(csr.published),
  intro_images: normalizeImages(csr.intro_images),
  slider_images: normalizeImages(csr.slider_images),
  created_at: csr.created_at || "",
  updated_at: csr.updated_at || "",
});

export const getResponseRecord = (responseData) => {
  const data = responseData?.data ?? responseData;
  if (Array.isArray(data)) return data[0] || null;
  return data || null;
};

export const buildCsrPayload = (formData, toUploadPath) => ({
  banner_image: toUploadPath(formData.banner_image) || null,
  intro_title: formData.intro_title.trim() || null,
  intro_description: formData.intro_description.trim() || null,
  project_title: formData.project_title.trim() || null,
  project_description: formData.project_description.trim() || null,
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
  published: formData.published,
  intro_images: formData.intro_images.map((item, index) => ({
    image: toUploadPath(item.image) || null,
    sort_order: index,
    status: item.status,
  })),
  slider_images: formData.slider_images.map((item, index) => ({
    image: toUploadPath(item.image) || null,
    sort_order: index,
    status: item.status,
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
