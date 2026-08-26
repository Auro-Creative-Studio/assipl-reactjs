import axios from "axios";
import { ArrowLeft, FileText, Globe, Save } from "lucide-react";
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

const BLOG_ENDPOINT = `${API_ROOT}/blogs`;
const BLOG_CATEGORY_ENDPOINT = `${API_ROOT}/blog-categories`;

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

const initialForm = {
  category_id: "",
  title: "",
  description: "",
  featured_image: "",
  main_image: "",
  blog_image_1: "",
  blog_image_2: "",
  description_1: "",
  description_2: "",
  description_3: "",
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

const imageFields = [
  {
    name: "featured_image",
    label: "Featured Image",
    helperText: "Used in blog cards and highlights.",
  },
  {
    name: "main_image",
    label: "Main Image",
    helperText: "Primary image shown on the blog detail page.",
  },
  {
    name: "blog_image_1",
    label: "Blog Image 1",
    helperText: "Optional image for the first content section.",
  },
  {
    name: "blog_image_2",
    label: "Blog Image 2",
    helperText: "Optional image for the second content section.",
  },
  {
    name: "og_image",
    label: "OG Image",
    helperText: "Social sharing image.",
  },
];

const normalizeForm = (blog = {}) => ({
  category_id: blog.category_id ? String(blog.category_id) : "",
  title: blog.title || "",
  description: blog.description || "",
  featured_image: blog.featured_image || "",
  main_image: blog.main_image || "",
  blog_image_1: blog.blog_image_1 || "",
  blog_image_2: blog.blog_image_2 || "",
  description_1: blog.description_1 || "",
  description_2: blog.description_2 || "",
  description_3: blog.description_3 || "",
  meta_title: blog.meta_title || "",
  meta_description: blog.meta_description || "",
  meta_keywords: blog.meta_keywords || "",
  og_title: blog.og_title || "",
  og_description: blog.og_description || "",
  og_image: blog.og_image || "",
  image_alt_text: blog.image_alt_text || "",
  robots_index: blog.robots_index || "index",
  robots_follow: blog.robots_follow || "follow",
  published: blog.published === undefined ? true : Boolean(blog.published),
});

const buildPayload = (formData) => ({
  category_id: formData.category_id ? Number(formData.category_id) : null,
  title: formData.title.trim(),
  description: formData.description.trim() || null,
  featured_image: toUploadPath(formData.featured_image) || null,
  main_image: toUploadPath(formData.main_image) || null,
  blog_image_1: toUploadPath(formData.blog_image_1) || null,
  blog_image_2: toUploadPath(formData.blog_image_2) || null,
  description_1: formData.description_1.trim() || null,
  description_2: formData.description_2.trim() || null,
  description_3: formData.description_3.trim() || null,
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

const ImageField = ({ field, value, onChange }) => (
  <CmsMediaSelect
    label={field.label}
    name={field.name}
    value={value}
    onChange={(media) =>
      onChange({
        target: {
          name: field.name,
          value: getMediaUrl(media),
        },
      })
    }
    allowedType="image"
    accept="image/*"
    helperText={field.helperText}
  />
);

export default function BlogForm({ blogId = null, mode = "create" }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [loadError, setLoadError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isLoading, setIsLoading] = useState(Boolean(blogId));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("content");
  const isEdit = mode === "edit";

  useEffect(() => {
    const fetchFormData = async () => {
      setIsLoading(Boolean(blogId));
      setLoadError("");

      try {
        const requests = [
          axios.get(BLOG_CATEGORY_ENDPOINT, {
            headers: getAuthHeaders(),
          }),
        ];

        if (blogId) {
          requests.push(
            axios.get(`${BLOG_ENDPOINT}/${blogId}`, {
              headers: getAuthHeaders(),
            })
          );
        }

        const [categoryResponse, blogResponse] = await Promise.all(requests);

        setCategories(categoryResponse.data?.data || []);

        if (blogResponse) {
          setFormData(normalizeForm(blogResponse.data?.data || {}));
        }
      } catch (err) {
        setLoadError(
          err.response?.data?.message || err.message || "Failed to load blog data."
        );
      } finally {
        setIsLoading(false);
      }
    };

    void Promise.resolve().then(fetchFormData);
  }, [blogId]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!formData.title.trim()) {
      nextErrors.title = "Blog title is required.";
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
        await axios.put(`${BLOG_ENDPOINT}/${blogId}`, payload, {
          headers: getAuthHeaders(),
        });
      } else {
        await axios.post(BLOG_ENDPOINT, payload, {
          headers: getAuthHeaders(),
        });
      }

      navigate("/admin/blogs");
    } catch (err) {
      setSubmitError(
        err.response?.data?.message || err.message || "Failed to save blog."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryOptions = categories.map((category) => ({
    label: category.name,
    value: String(category.id),
  }));

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
            CMS Blogs
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">
            {isEdit ? "Edit Blog" : "Create Blog"}
          </h1>
          <p className="mt-2 text-sm font-semibold text-slate-500">
            Manage blog content, images, metadata, and publishing status.
          </p>
        </div>

        <Link to="/admin/blogs">
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
          <p className="text-sm font-semibold">Loading blog data...</p>
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
                  placeholder="Enter blog title"
                  error={errors.title}
                  required
                />

                <Textarea
                  label="Header Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Brief summary for the blog header."
                  rows={3}
                />

                <RichTextEditor
                  label="Description 1"
                  name="description_1"
                  value={formData.description_1}
                  onChange={handleChange}
                  placeholder="Opening blog content section."
                />

                <RichTextEditor
                  label="Description 2"
                  name="description_2"
                  value={formData.description_2}
                  onChange={handleChange}
                  placeholder="Second blog content section."
                />

                <RichTextEditor
                  label="Description 3"
                  name="description_3"
                  value={formData.description_3}
                  onChange={handleChange}
                  placeholder="Final blog content section."
                />

                <div className="grid gap-5 md:grid-cols-2">
                  {imageFields
                    .filter((field) => field.name !== "og_image")
                    .map((field) => (
                      <ImageField
                        key={field.name}
                        field={field}
                        value={formData[field.name]}
                        onChange={handleChange}
                      />
                    ))}
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
                  placeholder="blog, marketing, branding"
                  rows={3}
                />

                <Textarea
                  label="OG Description"
                  name="og_description"
                  value={formData.og_description}
                  onChange={handleChange}
                  placeholder="Description shown when this blog is shared."
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
                  placeholder="Accessible description for blog images"
                />

                <ImageField
                  field={imageFields.find((field) => field.name === "og_image")}
                  value={formData.og_image}
                  onChange={handleChange}
                />
                </div>
              )}
            </div>

            <aside className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm xl:sticky xl:top-24 xl:self-start">
              <Select
                label="Category"
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                options={categoryOptions}
                placeholder="No category"
              />

              <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <span>
                  <span className="block text-sm font-black text-slate-950">
                    Published
                  </span>
                  <span className="mt-1 block text-xs font-semibold text-slate-500">
                    Visible through the published blogs API.
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
                {isEdit ? "Update Blog" : "Save Blog"}
              </Button>
            </aside>
          </section>
        </form>
      )}
    </div>
  );
}
