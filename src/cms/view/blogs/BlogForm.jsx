import axios from "axios";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  FileText,
  Globe,
  Image as ImageIcon,
  Plus,
  Save,
  Trash2,
  Type,
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

const BLOG_ENDPOINT = `${API_ROOT}/blogs`;

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

const createBlockId = () =>
  `block-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const createBlock = (type = "text") => ({
  id: createBlockId(),
  type,
  heading: "",
  body: "",
  image: "",
  image_position: "left",
});

const initialForm = {
  title: "",
  excerpt: "",
  description: "",
  featured_image: "",
  hero_image: "",
  content_blocks: [],
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

const normalizeBlocks = (blocks) => {
  if (!Array.isArray(blocks)) return [];

  return blocks.map((block) => ({
    id: block.id || createBlockId(),
    type: block.type === "image_text" ? "image_text" : "text",
    heading: block.heading || "",
    body: block.body || "",
    image: block.image || "",
    image_position: block.image_position === "right" ? "right" : "left",
  }));
};

const normalizeForm = (blog = {}) => ({
  title: blog.title || "",
  excerpt: blog.excerpt || "",
  description: blog.description || "",
  featured_image: blog.featured_image || "",
  hero_image: blog.hero_image || "",
  content_blocks: normalizeBlocks(blog.content_blocks),
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
  title: formData.title.trim(),
  excerpt: formData.excerpt.trim() || null,
  description: formData.description.trim() || null,
  featured_image: toUploadPath(formData.featured_image) || null,
  hero_image: toUploadPath(formData.hero_image) || null,
  content_blocks: formData.content_blocks.map((block) => ({
    id: block.id,
    type: block.type,
    heading: block.heading.trim(),
    body: block.body,
    image: block.type === "image_text" ? toUploadPath(block.image) || null : null,
    image_position: block.image_position,
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

function ContentBlockCard({ block, index, total, onChange, onMove, onRemove }) {
  const handleField = (field) => (event) => {
    const value =
      event?.target?.name !== undefined ? event.target.value : event;

    onChange({ ...block, [field]: value });
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-950 text-xs font-black text-white">
            {index + 1}
          </span>
          <span className="text-sm font-black text-slate-950">
            {block.type === "image_text" ? "Image + Text Section" : "Text Section"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            disabled={index === 0}
            onClick={() => onMove(-1)}
            icon={<ArrowUp className="h-3.5 w-3.5" />}
            aria-label="Move section up"
          />
          <Button
            type="button"
            size="sm"
            variant="secondary"
            disabled={index === total - 1}
            onClick={() => onMove(1)}
            icon={<ArrowDown className="h-3.5 w-3.5" />}
            aria-label="Move section down"
          />
          <Button
            type="button"
            size="sm"
            variant="danger"
            onClick={onRemove}
            icon={<Trash2 className="h-3.5 w-3.5" />}
            aria-label="Remove section"
          />
        </div>
      </div>

      <div className="space-y-4">
        <Select
          label="Section Type"
          name={`type-${block.id}`}
          value={block.type}
          onChange={(event) =>
            onChange({
              ...block,
              type: event.target.value,
            })
          }
          options={[
            { label: "Text only", value: "text" },
            { label: "Image + text", value: "image_text" },
          ]}
        />

        <Input
          label="Section Heading"
          name={`heading-${block.id}`}
          value={block.heading}
          onChange={handleField("heading")}
          placeholder="e.g. Security Threats Don't Wait"
        />

        {block.type === "image_text" && (
          <div className="grid gap-4 md:grid-cols-2">
            <ImageField
              label="Section Image"
              name={`image-${block.id}`}
              value={block.image}
              onChange={handleField("image")}
              helperText="Shown alongside the section text."
            />
            <Select
              label="Image Position"
              name={`image_position-${block.id}`}
              value={block.image_position}
              onChange={handleField("image_position")}
              options={[
                { label: "Left", value: "left" },
                { label: "Right", value: "right" },
              ]}
            />
          </div>
        )}

        <RichTextEditor
          label="Section Content"
          name={`body-${block.id}`}
          value={block.body}
          onChange={handleField("body")}
          placeholder="Write the section content. Use bold and bullet lists as needed."
        />
      </div>
    </div>
  );
}

export default function BlogForm({ blogId = null, mode = "create" }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
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
        if (blogId) {
          const blogResponse = await axios.get(`${BLOG_ENDPOINT}/${blogId}`, {
            headers: getAuthHeaders(),
          });
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

  const updateBlock = (blockId, nextBlock) => {
    setFormData((current) => ({
      ...current,
      content_blocks: current.content_blocks.map((block) =>
        block.id === blockId ? nextBlock : block
      ),
    }));
  };

  const moveBlock = (index, direction) => {
    setFormData((current) => {
      const blocks = [...current.content_blocks];
      const targetIndex = index + direction;

      if (targetIndex < 0 || targetIndex >= blocks.length) return current;

      [blocks[index], blocks[targetIndex]] = [blocks[targetIndex], blocks[index]];

      return { ...current, content_blocks: blocks };
    });
  };

  const removeBlock = (blockId) => {
    setFormData((current) => ({
      ...current,
      content_blocks: current.content_blocks.filter((block) => block.id !== blockId),
    }));
  };

  const addBlock = (type) => {
    setFormData((current) => ({
      ...current,
      content_blocks: [...current.content_blocks, createBlock(type)],
    }));
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
                    label="Card Excerpt"
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleChange}
                    placeholder="Short teaser shown on the blog listing card."
                    rows={2}
                  />

                  <Textarea
                    label="Header Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Intro paragraph shown right under the blog title."
                    rows={3}
                  />

                  <div className="grid gap-5 md:grid-cols-2">
                    <ImageField
                      label="Featured Image"
                      name="featured_image"
                      value={formData.featured_image}
                      onChange={handleChange}
                      helperText="Used as the thumbnail on the blogs listing page."
                    />
                    <ImageField
                      label="Hero Background Image"
                      name="hero_image"
                      value={formData.hero_image}
                      onChange={handleChange}
                      helperText="Full-width background behind the blog title."
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">
                        Content Sections
                      </h2>
                    </div>

                    {formData.content_blocks.length === 0 && (
                      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center text-sm font-semibold text-slate-400">
                        No content sections yet. Add a text or image + text section below.
                      </div>
                    )}

                    <div className="space-y-4">
                      {formData.content_blocks.map((block, index) => (
                        <ContentBlockCard
                          key={block.id}
                          block={block}
                          index={index}
                          total={formData.content_blocks.length}
                          onChange={(nextBlock) => updateBlock(block.id, nextBlock)}
                          onMove={(direction) => moveBlock(index, direction)}
                          onRemove={() => removeBlock(block.id)}
                        />
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Button
                        type="button"
                        variant="secondary"
                        icon={<Type className="h-4 w-4" />}
                        onClick={() => addBlock("text")}
                      >
                        Add Text Section
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        icon={<ImageIcon className="h-4 w-4" />}
                        onClick={() => addBlock("image_text")}
                      >
                        Add Image + Text Section
                      </Button>
                    </div>
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
