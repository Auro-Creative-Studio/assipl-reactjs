const API_ROOT = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api"
).replace(/\/$/, "");

export const PROCESS_ENDPOINT = `${API_ROOT}/process`;

export const createItemId = () => `item-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export const createPointItem = () => ({ id: createItemId(), label: "", text: "" });
export const createStepItem = () => ({
  id: createItemId(),
  icon: "",
  image: "",
  title: "",
  points: [createPointItem()],
});

const normalizePoints = (items) => {
  if (!Array.isArray(items)) return [];
  return items.map((item) => ({
    id: item.id || createItemId(),
    label: item.label || "",
    text: item.text || "",
  }));
};

const normalizeSteps = (items) => {
  if (!Array.isArray(items)) return [];
  return items.map((item) => ({
    id: item.id || createItemId(),
    icon: item.icon || "",
    image: item.image || "",
    title: item.title || "",
    points: normalizePoints(item.points),
  }));
};

export const createBlankProcessForm = () => ({
  id: null,
  hero_background_image: "",
  hero_title: "",
  intro_heading: "",
  intro_description: "",
  steps: [],
  cta_background_image: "",
  cta_heading: "",
  cta_description: "",
  cta_button_label: "",
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

export const normalizeProcess = (process = {}) => ({
  id: process.id ?? null,
  hero_background_image: process.hero_background_image || "",
  hero_title: process.hero_title || "",
  intro_heading: process.intro_heading || "",
  intro_description: process.intro_description || "",
  steps: normalizeSteps(process.steps),
  cta_background_image: process.cta_background_image || "",
  cta_heading: process.cta_heading || "",
  cta_description: process.cta_description || "",
  cta_button_label: process.cta_button_label || "",
  meta_title: process.meta_title || "",
  meta_description: process.meta_description || "",
  meta_keywords: process.meta_keywords || "",
  og_title: process.og_title || "",
  og_description: process.og_description || "",
  og_image: process.og_image || "",
  image_alt_text: process.image_alt_text || "",
  robots_index: process.robots_index || "index",
  robots_follow: process.robots_follow || "follow",
  status: process.status === undefined ? true : Boolean(process.status),
  created_at: process.created_at || "",
  updated_at: process.updated_at || "",
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

export const buildProcessPayload = (formData, toUploadPath) => ({
  hero_background_image: toUploadPath(formData.hero_background_image) || null,
  hero_title: formData.hero_title.trim() || null,
  intro_heading: formData.intro_heading.trim() || null,
  intro_description: formData.intro_description.trim() || null,
  steps: formData.steps.map((step) => ({
    icon: toUploadPath(step.icon) || null,
    image: toUploadPath(step.image) || null,
    title: step.title.trim(),
    points: step.points.map((point) => stripId(point)),
  })),
  cta_background_image: toUploadPath(formData.cta_background_image) || null,
  cta_heading: formData.cta_heading.trim() || null,
  cta_description: formData.cta_description.trim() || null,
  cta_button_label: formData.cta_button_label.trim() || null,
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
