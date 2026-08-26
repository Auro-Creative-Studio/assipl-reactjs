import axios from "axios";
import { ArrowLeft, Save } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input, Select, Textarea } from "../../components/ui/uiExports";
import { getAuthHeaders } from "../../utils/auth";

const API_ROOT = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api"
).replace(/\/$/, "");

const SEO_ENDPOINT = `${API_ROOT}/seo`;

const initialForm = {
  page_type: "",
  meta_title: "",
  meta_description: "",
  meta_keywords: "",
  og_title: "",
  og_description: "",
  og_image: "",
  image_alt_text: "",
  robots_index: "index",
  robots_follow: "follow",
  is_active: true,
};

export default function SeoCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    if (!formData.page_type.trim()) {
      nextErrors.page_type = "Page type is required.";
    }

    if (!formData.meta_title.trim()) {
      nextErrors.meta_title = "Meta title is required.";
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
      await axios.post(SEO_ENDPOINT, formData, {
        headers: getAuthHeaders(),
      });
      navigate("/admin/seo");
    } catch (err) {
      setSubmitError(err.response?.data?.message || err.message || "Failed to create SEO page.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
            CMS SEO
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">Create SEO Page</h1>
          <p className="mt-2 text-sm font-semibold text-slate-500">
            Add metadata and crawler rules for a public page.
          </p>
        </div>

        <Link to="/admin/seo">
          <Button variant="secondary" icon={<ArrowLeft className="h-4 w-4" />}>
            Back to List
          </Button>
        </Link>
      </section>

      {submitError && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <section className="space-y-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label="Page Type"
              name="page_type"
              value={formData.page_type}
              onChange={handleChange}
              placeholder="home, about, services"
              error={errors.page_type}
              required
            />
            <Input
              label="Meta Title"
              name="meta_title"
              value={formData.meta_title}
              onChange={handleChange}
              placeholder="Assipl | Digital Marketing Agency"
              error={errors.meta_title}
              required
            />
          </div>

          <Textarea
            label="Meta Description"
            name="meta_description"
            value={formData.meta_description}
            onChange={handleChange}
            placeholder="Short search result description for this page."
            rows={4}
          />

          <Textarea
            label="Meta Keywords"
            name="meta_keywords"
            value={formData.meta_keywords}
            onChange={handleChange}
            placeholder="digital marketing, social media, branding"
            rows={3}
          />

          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label="OG Title"
              name="og_title"
              value={formData.og_title}
              onChange={handleChange}
              placeholder="Social sharing title"
            />
            <Input
              label="OG Image URL"
              name="og_image"
              value={formData.og_image}
              onChange={handleChange}
              placeholder="https://example.com/og-image.jpg"
            />
          </div>

          <Textarea
            label="OG Description"
            name="og_description"
            value={formData.og_description}
            onChange={handleChange}
            placeholder="Description shown when this page is shared."
            rows={4}
          />

          <Input
            label="Image Alt Text"
            name="image_alt_text"
            value={formData.image_alt_text}
            onChange={handleChange}
            placeholder="Accessible description for the OG image"
          />
        </section>

        <aside className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
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

          <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <span>
              <span className="block text-sm font-black text-slate-950">Active</span>
              <span className="mt-1 block text-xs font-semibold text-slate-500">
                Available for page lookup by page type.
              </span>
            </span>
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
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
            Save SEO
          </Button>
        </aside>
      </form>
    </div>
  );
}
