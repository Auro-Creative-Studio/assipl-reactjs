import axios from "axios";
import {
  ArrowDown,
  ArrowUp,
  ExternalLink,
  FileText,
  Globe,
  Plus,
  RefreshCw,
  Save,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, CmsMediaSelect, CmsToast, Input, RichTextEditor, Select, Textarea } from "../../../components/ui/uiExports";
import { getAuthHeaders } from "../../../utils/auth";
import {
  ABOUT_ENDPOINT,
  buildAboutPayload,
  createAboutFeature,
  createAboutLogo,
  createBlankAboutForm,
  formatDate,
  getResponseRecord,
  normalizeAbout,
  toAboutUploadPath,
} from "./aboutPageUtils";

const getMediaUrl = (media) => {
  if (!media) return "";
  if (typeof media === "string") return media;

  return toAboutUploadPath(media.url || "");
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

const FileField = ({ label, name, value, onChange, helperText }) => (
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
    allowedType="file"
    accept="application/pdf"
    allowedExtensions={["pdf"]}
    uploadHint="PDF"
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

function LogoRepeaterCard({ item, index, total, onChange, onMove, onRemove }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
      <RepeaterHeader index={index} total={total} label="Logo" onMove={onMove} onRemove={onRemove} />
      <ImageField
        label="Logo Image"
        name={`logo-image-${item.id}`}
        value={item.logo}
        onChange={(event) => onChange({ ...item, logo: event.target.value })}
      />
    </div>
  );
}

function FeatureRepeaterCard({ item, index, total, onChange, onMove, onRemove }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
      <RepeaterHeader index={index} total={total} label="Feature" onMove={onMove} onRemove={onRemove} />
      <div className="grid gap-4 md:grid-cols-2">
        <ImageField
          label="Feature Icon"
          name={`feature-logo-${item.id}`}
          value={item.logo}
          onChange={(event) => onChange({ ...item, logo: event.target.value })}
        />
        <Textarea
          label="Feature Description"
          name={`feature-description-${item.id}`}
          value={item.description}
          onChange={(event) => onChange({ ...item, description: event.target.value })}
          placeholder="e.g. ISO 27001 certified security operations."
          rows={3}
        />
      </div>
    </div>
  );
}

export default function CmsAboutPage() {
  const [aboutId, setAboutId] = useState(null);
  const [formData, setFormData] = useState(createBlankAboutForm());
  const [loadError, setLoadError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("content");
  const isEdit = Boolean(aboutId);

  const loadAboutData = async () => {
    const response = await axios.get(ABOUT_ENDPOINT, { headers: getAuthHeaders() });
    const existingAbout = getResponseRecord(response.data);

    if (existingAbout) {
      const normalizedAbout = normalizeAbout(existingAbout);
      setAboutId(normalizedAbout.id);
      setFormData(normalizedAbout);
      return;
    }

    setAboutId(null);
    setFormData(createBlankAboutForm());
  };

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      try {
        await loadAboutData();
      } catch (err) {
        if (isMounted) {
          setLoadError(err.response?.data?.message || err.message || "Failed to load About page.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void initialize();

    return () => {
      isMounted = false;
    };
  }, []);

  const fetchAboutPage = async () => {
    setIsLoading(true);
    setLoadError("");

    try {
      await loadAboutData();
    } catch (err) {
      setLoadError(err.response?.data?.message || err.message || "Failed to load About page.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSubmitError("");
    setSubmitSuccess("");
    setIsSubmitting(true);

    try {
      const payload = buildAboutPayload(formData, toAboutUploadPath);

      const response = isEdit
        ? await axios.put(`${ABOUT_ENDPOINT}/${aboutId}`, payload, { headers: getAuthHeaders() })
        : await axios.post(ABOUT_ENDPOINT, payload, { headers: getAuthHeaders() });

      const savedAbout = getResponseRecord(response.data);

      if (savedAbout) {
        const normalizedAbout = normalizeAbout(savedAbout);
        setAboutId(normalizedAbout.id ?? aboutId);
        setFormData(normalizedAbout);
      }

      setSubmitSuccess(isEdit ? "About page updated." : "About page created.");
    } catch (err) {
      setSubmitError(err.response?.data?.message || err.message || "Failed to save About page.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">CMS Pages</p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-black text-slate-950">About Page</h1>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">
              Single Page
            </span>
          </div>
          <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-500">
            Manage the public About page banner, company overview, manufacturer logos, features, and status.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/about"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            <ExternalLink className="h-4 w-4" />
            View Public Page
          </Link>

          <Button
            variant="secondary"
            icon={<RefreshCw className="h-4 w-4" />}
            onClick={fetchAboutPage}
            disabled={isLoading}
          >
            Refresh
          </Button>
        </div>
      </section>

      {(loadError || submitError) && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
          {loadError || submitError}
        </div>
      )}

      <CmsToast message={submitSuccess} onClose={() => setSubmitSuccess("")} />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white py-16 text-slate-500 shadow-sm">
          <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-slate-200 border-t-slate-950" />
          <p className="text-sm font-semibold">Loading About page data...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[3fr_1fr]">
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
                <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">Banner</h2>
                <div className="grid gap-5">
                  <ImageField
                    label="Banner Image"
                    name="banner_image"
                    value={formData.banner_image}
                    onChange={handleChange}
                    helperText="Full-width hero background image."
                  />
                  <Input
                    label="Banner Title"
                    name="banner_title"
                    value={formData.banner_title}
                    onChange={handleChange}
                    placeholder="e.g. Engineering Trust. Delivering Excellence."
                  />
                  <Textarea
                    label="Banner Description"
                    name="banner_description"
                    value={formData.banner_description}
                    onChange={handleChange}
                    placeholder="Short tagline shown under the banner title."
                    rows={2}
                  />
                </div>

                <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">
                  About
                </h2>
                <div className="grid gap-5">
                  <ImageField
                    label="About Image"
                    name="about_image"
                    value={formData.about_image}
                    onChange={handleChange}
                    helperText="Image shown alongside the company overview."
                  />
                  <Input
                    label="About Title"
                    name="about_title"
                    value={formData.about_title}
                    onChange={handleChange}
                    placeholder="e.g. Who We Are"
                  />
                  <RichTextEditor
                    label="About Description"
                    name="about_description"
                    value={formData.about_description}
                    onChange={handleChange}
                    placeholder="Company overview content."
                  />
                  <FileField
                    label="Download Brochure"
                    name="download_brochure"
                    value={formData.download_brochure}
                    onChange={handleChange}
                    helperText="PDF brochure available for download."
                  />
                </div>

                <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">
                  Manufacturer Logos
                </h2>
                <Input
                  label="Manufacturer Section Title"
                  name="manufacture_title"
                  value={formData.manufacture_title}
                  onChange={handleChange}
                  placeholder="e.g. Authorized Manufacturer & Distribution Partner"
                />

                {formData.logos.length === 0 && (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center text-sm font-semibold text-slate-400">
                    No logos yet. Add one below.
                  </div>
                )}

                <div className="space-y-4">
                  {formData.logos.map((item, index) => (
                    <LogoRepeaterCard
                      key={item.id}
                      item={item}
                      index={index}
                      total={formData.logos.length}
                      onChange={(nextItem) => updateListItem("logos", item.id, nextItem)}
                      onMove={(direction) => moveListItem("logos", index, direction)}
                      onRemove={() => removeListItem("logos", item.id)}
                    />
                  ))}
                </div>

                <Button
                  type="button"
                  variant="secondary"
                  icon={<Plus className="h-4 w-4" />}
                  onClick={() => addListItem("logos", createAboutLogo)}
                >
                  Add Logo
                </Button>

                <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">
                  Features
                </h2>

                {formData.features.length === 0 && (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center text-sm font-semibold text-slate-400">
                    No features yet. Add one below.
                  </div>
                )}

                <div className="space-y-4">
                  {formData.features.map((item, index) => (
                    <FeatureRepeaterCard
                      key={item.id}
                      item={item}
                      index={index}
                      total={formData.features.length}
                      onChange={(nextItem) => updateListItem("features", item.id, nextItem)}
                      onMove={(direction) => moveListItem("features", index, direction)}
                      onRemove={() => removeListItem("features", item.id)}
                    />
                  ))}
                </div>

                <Button
                  type="button"
                  variant="secondary"
                  icon={<Plus className="h-4 w-4" />}
                  onClick={() => addListItem("features", createAboutFeature)}
                >
                  Add Feature
                </Button>

                <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">
                  Securing the Future
                </h2>
                <div className="grid gap-5">
                  <Input
                    label="Securing Title"
                    name="securing_title"
                    value={formData.securing_title}
                    onChange={handleChange}
                    placeholder="e.g. Securing the Future"
                  />
                  <RichTextEditor
                    label="Securing Description"
                    name="securing_description"
                    value={formData.securing_description}
                    onChange={handleChange}
                    placeholder="Content for the securing-the-future section."
                  />
                  <ImageField
                    label="Securing Image"
                    name="securing_image"
                    value={formData.securing_image}
                    onChange={handleChange}
                  />
                </div>

                <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">
                  Built for What&apos;s Next
                </h2>
                <div className="grid gap-5">
                  <Input
                    label="Future Title"
                    name="future_title"
                    value={formData.future_title}
                    onChange={handleChange}
                    placeholder="e.g. Built for What's Next"
                  />
                  <RichTextEditor
                    label="Future Description"
                    name="future_description"
                    value={formData.future_description}
                    onChange={handleChange}
                    placeholder="Content for the future roadmap section."
                  />
                  <ImageField
                    label="Future Image"
                    name="future_image"
                    value={formData.future_image}
                    onChange={handleChange}
                  />
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
                    placeholder="About Us | ASSIPL"
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
                  placeholder="Learn about ASSIPL's mission, manufacturing partnerships, and vision."
                  rows={3}
                />

                <Textarea
                  label="Meta Keywords"
                  name="meta_keywords"
                  value={formData.meta_keywords}
                  onChange={handleChange}
                  placeholder="about assipl, enterprise security, manufacturing partner"
                  rows={3}
                />

                <Textarea
                  label="OG Description"
                  name="og_description"
                  value={formData.og_description}
                  onChange={handleChange}
                  placeholder="Description shown when this page is shared."
                  rows={3}
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
                  placeholder="Accessible description for the About page images"
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
                <span className="block text-sm font-black text-slate-950">Published</span>
                <span className="mt-1 block text-xs font-semibold text-slate-500">
                  Visible on the public About page.
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

            {isEdit && formData.updated_at && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                  Last Updated
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-600">
                  {formatDate(formData.updated_at)}
                </p>
              </div>
            )}

            <Button type="submit" fullWidth isLoading={isSubmitting} icon={<Save className="h-4 w-4" />}>
              {isEdit ? "Update About Page" : "Create About Page"}
            </Button>
          </aside>
        </form>
      )}
    </div>
  );
}
