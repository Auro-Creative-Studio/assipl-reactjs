import axios from "axios";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  FileText,
  Globe,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  CmsMediaSelect,
  Input,
  RichTextEditor,
  Select,
  Textarea,
} from "../../components/ui/uiExports";
import { getAuthHeaders } from "../../utils/auth";

const API_ROOT = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api"
).replace(/\/$/, "");

const PRODUCT_ENDPOINT = `${API_ROOT}/products`;

const toUploadPath = (value = "") => {
  const textValue = String(value || "").trim();

  if (!textValue) return "";

  const cleanPath = (path) => path.replace(/^\/+/, "").replace(/^api\/uploads\//, "uploads/");

  try {
    const url = new URL(textValue);
    const uploadPath = cleanPath(url.pathname);
    return uploadPath || textValue;
  } catch {
    return cleanPath(textValue);
  }
};

const createItemId = () => `item-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const createCapability = () => ({ id: createItemId(), title: "", body: "" });
const createUseCase = () => ({ id: createItemId(), title: "", image: "" });

const initialForm = {
  title: "",
  menu_title: "",
  excerpt: "",
  heading: "",
  front_image: "",
  rear_image: "",
  hero_image: "",
  main_image: "",
  subtitle: "",
  description: "",
  capabilities: [],
  use_cases: [],
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
};

const normalizeCapabilities = (items) => {
  if (!Array.isArray(items)) return [];

  return items.map((item) => ({
    id: item.id || createItemId(),
    title: item.title || "",
    body: item.body || "",
  }));
};

const normalizeUseCases = (items) => {
  if (!Array.isArray(items)) return [];

  return items.map((item) => ({
    id: item.id || createItemId(),
    title: item.title || "",
    image: item.image || "",
  }));
};

const normalizeForm = (product = {}) => ({
  title: product.title || "",
  menu_title: product.menu_title || "",
  excerpt: product.excerpt || "",
  heading: product.heading || "",
  front_image: product.front_image || "",
  rear_image: product.rear_image || "",
  hero_image: product.hero_image || "",
  main_image: product.main_image || "",
  subtitle: product.subtitle || "",
  description: product.description || "",
  capabilities: normalizeCapabilities(product.capabilities),
  use_cases: normalizeUseCases(product.use_cases),
  meta_title: product.meta_title || "",
  meta_description: product.meta_description || "",
  meta_keywords: product.meta_keywords || "",
  og_title: product.og_title || "",
  og_description: product.og_description || "",
  og_image: product.og_image || "",
  image_alt_text: product.image_alt_text || "",
  robots_index: product.robots_index || "index",
  robots_follow: product.robots_follow || "follow",
  published: product.published === undefined ? true : Boolean(product.published),
});

const buildPayload = (formData) => ({
  title: formData.title.trim(),
  menu_title: formData.menu_title.trim() || null,
  excerpt: formData.excerpt.trim() || null,
  heading: formData.heading.trim() || null,
  front_image: toUploadPath(formData.front_image) || null,
  rear_image: toUploadPath(formData.rear_image) || null,
  hero_image: toUploadPath(formData.hero_image) || null,
  main_image: toUploadPath(formData.main_image) || null,
  subtitle: formData.subtitle.trim() || null,
  description: formData.description.trim() || null,
  capabilities: formData.capabilities.map((item) => ({
    id: item.id,
    title: item.title.trim(),
    body: item.body,
  })),
  use_cases: formData.use_cases.map((item) => ({
    id: item.id,
    title: item.title.trim(),
    image: toUploadPath(item.image) || null,
  })),
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
});

const getMediaUrl = (media) => {
  if (!media) return "";
  if (typeof media === "string") return media;

  return toUploadPath(media.url || "");
};

const ImageField = ({ label, name, value, onChange, helperText }) => (
  <CmsMediaSelect
    label={label}
    name={name}
    value={value}
    onChange={(media) =>
      onChange({
        target: {
          name,
          value: getMediaUrl(media),
        },
      })
    }
    allowedType="image"
    accept="image/*"
    helperText={helperText}
  />
);

function RepeaterHeader({ index, total, label, onMove, onRemove }) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-950 text-xs font-black text-white">
          {index + 1}
        </span>
        <span className="text-sm font-black text-slate-950">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          size="sm"
          variant="secondary"
          disabled={index === 0}
          onClick={() => onMove(-1)}
          icon={<ArrowUp className="h-3.5 w-3.5" />}
          aria-label="Move up"
        />
        <Button
          type="button"
          size="sm"
          variant="secondary"
          disabled={index === total - 1}
          onClick={() => onMove(1)}
          icon={<ArrowDown className="h-3.5 w-3.5" />}
          aria-label="Move down"
        />
        <Button
          type="button"
          size="sm"
          variant="danger"
          onClick={onRemove}
          icon={<Trash2 className="h-3.5 w-3.5" />}
          aria-label="Remove"
        />
      </div>
    </div>
  );
}

function CapabilityCard({ item, index, total, onChange, onMove, onRemove }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
      <RepeaterHeader
        index={index}
        total={total}
        label="Capability"
        onMove={onMove}
        onRemove={onRemove}
      />

      <div className="space-y-4">
        <Input
          label="Capability Title"
          name={`capability-title-${item.id}`}
          value={item.title}
          onChange={(event) => onChange({ ...item, title: event.target.value })}
          placeholder="e.g. IP CCTV Surveillance"
        />

        <RichTextEditor
          label="Capability Points"
          name={`capability-body-${item.id}`}
          value={item.body}
          onChange={(event) => onChange({ ...item, body: event.target.value })}
          placeholder="Use a bulleted list for each point."
        />
      </div>
    </div>
  );
}

function UseCaseCard({ item, index, total, onChange, onMove, onRemove }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
      <RepeaterHeader
        index={index}
        total={total}
        label="Use Case"
        onMove={onMove}
        onRemove={onRemove}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Use Case Title"
          name={`use-case-title-${item.id}`}
          value={item.title}
          onChange={(event) => onChange({ ...item, title: event.target.value })}
          placeholder="e.g. Bank Branches & Currency Chests"
        />
        <ImageField
          label="Use Case Image"
          name={`use-case-image-${item.id}`}
          value={item.image}
          onChange={(event) => onChange({ ...item, image: event.target.value })}
          helperText="Shown in the 'Most commonly used in' grid."
        />
      </div>
    </div>
  );
}

export default function ProductForm({ productId = null, mode = "create" }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loadError, setLoadError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isLoading, setIsLoading] = useState(Boolean(productId));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("content");
  const isEdit = mode === "edit";

  useEffect(() => {
    const fetchFormData = async () => {
      setIsLoading(Boolean(productId));
      setLoadError("");

      try {
        if (productId) {
          const productResponse = await axios.get(`${PRODUCT_ENDPOINT}/${productId}`, {
            headers: getAuthHeaders(),
          });
          setFormData(normalizeForm(productResponse.data?.data || {}));
        }
      } catch (err) {
        setLoadError(
          err.response?.data?.message || err.message || "Failed to load product data."
        );
      } finally {
        setIsLoading(false);
      }
    };

    void Promise.resolve().then(fetchFormData);
  }, [productId]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const updateListItem = (key, itemId, nextItem) => {
    setFormData((current) => ({
      ...current,
      [key]: current[key].map((item) => (item.id === itemId ? nextItem : item)),
    }));
  };

  const moveListItem = (key, index, direction) => {
    setFormData((current) => {
      const items = [...current[key]];
      const targetIndex = index + direction;

      if (targetIndex < 0 || targetIndex >= items.length) return current;

      [items[index], items[targetIndex]] = [items[targetIndex], items[index]];

      return { ...current, [key]: items };
    });
  };

  const removeListItem = (key, itemId) => {
    setFormData((current) => ({
      ...current,
      [key]: current[key].filter((item) => item.id !== itemId),
    }));
  };

  const addListItem = (key, factory) => {
    setFormData((current) => ({
      ...current,
      [key]: [...current[key], factory()],
    }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!formData.title.trim()) {
      nextErrors.title = "Product title is required.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const payload = buildPayload(formData);

      if (isEdit) {
        await axios.put(`${PRODUCT_ENDPOINT}/${productId}`, payload, {
          headers: getAuthHeaders(),
        });
      } else {
        await axios.post(PRODUCT_ENDPOINT, payload, {
          headers: getAuthHeaders(),
        });
      }

      navigate("/admin/products");
    } catch (err) {
      setSubmitError(
        err.response?.data?.message || err.message || "Failed to save product."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
            CMS Products
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">
            {isEdit ? "Edit Product" : "Create Product"}
          </h1>
          <p className="mt-2 text-sm font-semibold text-slate-500">
            Manage product content, images, metadata, and publishing status.
          </p>
        </div>

        <Link to="/admin/products">
          <Button variant="secondary" icon={<ArrowLeft className="h-4 w-4" />}>
            Back to List
          </Button>
        </Link>
      </section>

      {(loadError || submitError) && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
          {loadError || submitError}
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white py-16 text-slate-500 shadow-sm">
          <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-slate-200 border-t-slate-950" />
          <p className="text-sm font-semibold">Loading product data...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="grid gap-6 xl:grid-cols-[1fr_340px]">
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="flex border-b border-slate-200 px-5 pt-4">
                <button
                  type="button"
                  onClick={() => setActiveTab("content")}
                  className={`flex min-h-11 items-center gap-2 border-b-2 px-4 text-sm font-black transition ${
                    activeTab === "content"
                      ? "border-primary text-primary"
                      : "border-transparent text-slate-500 hover:text-slate-950"
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  Content
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("metadata")}
                  className={`flex min-h-11 items-center gap-2 border-b-2 px-4 text-sm font-black transition ${
                    activeTab === "metadata"
                      ? "border-primary text-primary"
                      : "border-transparent text-slate-500 hover:text-slate-950"
                  }`}
                >
                  <Globe className="h-4 w-4" />
                  Metadata
                </button>
              </div>

              {activeTab === "content" ? (
                <div className="space-y-6 p-5">
                  <Input
                    label="Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Video Surveillance and Smart Cameras"
                    error={errors.title}
                    required
                  />

                  <Input
                    label="Menu Title"
                    name="menu_title"
                    value={formData.menu_title}
                    onChange={handleChange}
                    placeholder="Short label shown in the header Products dropdown. Falls back to Title if empty."
                  />

                  <Textarea
                    label="Card Excerpt"
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleChange}
                    placeholder="Short description shown on the hover of the product card."
                    rows={2}
                  />

                  <Input
                    label="Heading"
                    name="heading"
                    value={formData.heading}
                    onChange={handleChange}
                    placeholder="e.g. Enterprise IP Video Surveillance Solutions"
                  />

                  <div className="grid gap-5 md:grid-cols-2">
                    <ImageField
                      label="Card Front Image"
                      name="front_image"
                      value={formData.front_image}
                      onChange={handleChange}
                      helperText="Default image shown on the products grid card."
                    />
                    <ImageField
                      label="Card Hover Image"
                      name="rear_image"
                      value={formData.rear_image}
                      onChange={handleChange}
                      helperText="Image revealed when hovering the products grid card."
                    />
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <ImageField
                      label="Hero Background Image"
                      name="hero_image"
                      value={formData.hero_image}
                      onChange={handleChange}
                      helperText="Full-width background behind the product page title."
                    />
                    <ImageField
                      label="Main Image"
                      name="main_image"
                      value={formData.main_image}
                      onChange={handleChange}
                      helperText="Large image at the top of the product detail content."
                    />
                  </div>

                  <Input
                    label="Subtitle"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleChange}
                    placeholder="Short tagline shown under the product detail heading."
                  />

                  <Textarea
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Intro paragraph for the product detail page."
                    rows={4}
                  />

                  <div className="space-y-4">
                    <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">
                      Capabilities
                    </h2>

                    {formData.capabilities.length === 0 && (
                      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center text-sm font-semibold text-slate-400">
                        No capabilities yet. Add one below.
                      </div>
                    )}

                    <div className="space-y-4">
                      {formData.capabilities.map((item, index) => (
                        <CapabilityCard
                          key={item.id}
                          item={item}
                          index={index}
                          total={formData.capabilities.length}
                          onChange={(nextItem) => updateListItem("capabilities", item.id, nextItem)}
                          onMove={(direction) => moveListItem("capabilities", index, direction)}
                          onRemove={() => removeListItem("capabilities", item.id)}
                        />
                      ))}
                    </div>

                    <Button
                      type="button"
                      variant="secondary"
                      icon={<Plus className="h-4 w-4" />}
                      onClick={() => addListItem("capabilities", createCapability)}
                    >
                      Add Capability
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">
                      Use Cases
                    </h2>

                    {formData.use_cases.length === 0 && (
                      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center text-sm font-semibold text-slate-400">
                        No use cases yet. Add one below.
                      </div>
                    )}

                    <div className="space-y-4">
                      {formData.use_cases.map((item, index) => (
                        <UseCaseCard
                          key={item.id}
                          item={item}
                          index={index}
                          total={formData.use_cases.length}
                          onChange={(nextItem) => updateListItem("use_cases", item.id, nextItem)}
                          onMove={(direction) => moveListItem("use_cases", index, direction)}
                          onRemove={() => removeListItem("use_cases", item.id)}
                        />
                      ))}
                    </div>

                    <Button
                      type="button"
                      variant="secondary"
                      icon={<Plus className="h-4 w-4" />}
                      onClick={() => addListItem("use_cases", createUseCase)}
                    >
                      Add Use Case
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 p-5">
                  <div className="grid gap-5 md:grid-cols-2">
                    <Input
                      label="Meta Title"
                      name="meta_title"
                      value={formData.meta_title}
                      onChange={handleChange}
                      placeholder="Search result title"
                    />
                    <Input
                      label="OG Title"
                      name="og_title"
                      value={formData.og_title}
                      onChange={handleChange}
                      placeholder="Social sharing title"
                    />
                  </div>

                  <Textarea
                    label="Meta Description"
                    name="meta_description"
                    value={formData.meta_description}
                    onChange={handleChange}
                    placeholder="Search result description."
                    rows={4}
                  />

                  <Textarea
                    label="Meta Keywords"
                    name="meta_keywords"
                    value={formData.meta_keywords}
                    onChange={handleChange}
                    placeholder="cctv, access control, security"
                    rows={3}
                  />

                  <Textarea
                    label="OG Description"
                    name="og_description"
                    value={formData.og_description}
                    onChange={handleChange}
                    placeholder="Description shown when this product page is shared."
                    rows={4}
                  />

                  <div className="grid gap-5 md:grid-cols-2">
                    <Select
                      label="Robots Index"
                      name="robots_index"
                      value={formData.robots_index}
                      onChange={handleChange}
                      options={[
                        { label: "index", value: "index" },
                        { label: "noindex", value: "noindex" },
                      ]}
                    />

                    <Select
                      label="Robots Follow"
                      name="robots_follow"
                      value={formData.robots_follow}
                      onChange={handleChange}
                      options={[
                        { label: "follow", value: "follow" },
                        { label: "nofollow", value: "nofollow" },
                      ]}
                    />
                  </div>

                  <Input
                    label="Image Alt Text"
                    name="image_alt_text"
                    value={formData.image_alt_text}
                    onChange={handleChange}
                    placeholder="Accessible description for product images"
                  />

                  <ImageField
                    label="OG Image"
                    name="og_image"
                    value={formData.og_image}
                    onChange={handleChange}
                    helperText="Social sharing image."
                  />
                </div>
              )}
            </div>

            <aside className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm xl:sticky xl:top-24 xl:self-start">
              <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <span>
                  <span className="block text-sm font-black text-slate-950">
                    Published
                  </span>
                  <span className="mt-1 block text-xs font-semibold text-slate-500">
                    Visible through the published products API.
                  </span>
                </span>
                <input
                  type="checkbox"
                  name="published"
                  checked={formData.published}
                  onChange={handleChange}
                  className="h-5 w-5 rounded border-slate-300 accent-slate-950"
                />
              </label>

              <Button
                type="submit"
                fullWidth
                isLoading={isSubmitting}
                icon={<Save className="h-4 w-4" />}
              >
                {isEdit ? "Update Product" : "Save Product"}
              </Button>
            </aside>
          </section>
        </form>
      )}
    </div>
  );
}
