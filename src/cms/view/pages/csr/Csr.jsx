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
  buildCsrPayload,
  createBlankCsrForm,
  createCsrImage,
  CSR_ENDPOINT,
  formatDate,
  getResponseRecord,
  normalizeCsr,
} from "./csrPageUtils";

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

function ImageRepeaterCard({ item, index, total, label, onChange, onMove, onRemove }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-950 text-xs font-black text-white">
            {index + 1}
          </span>
          <span className="text-sm font-black text-slate-950">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-600">
            <input
              type="checkbox"
              checked={item.status}
              onChange={(event) => onChange({ ...item, status: event.target.checked })}
              className="h-4 w-4 rounded border-slate-300 accent-slate-950"
            />
            Active
          </label>
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

      <ImageField
        label="Image"
        name={`${label}-image-${item.id}`}
        value={item.image}
        onChange={(event) => onChange({ ...item, image: event.target.value })}
      />
    </div>
  );
}

export default function CmsCsrPage() {
  const [csrId, setCsrId] = useState(null);
  const [formData, setFormData] = useState(createBlankCsrForm());
  const [loadError, setLoadError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("content");
  const isEdit = Boolean(csrId);

  const loadCsrData = async () => {
    const response = await axios.get(CSR_ENDPOINT, { headers: getAuthHeaders() });
    const existingCsr = getResponseRecord(response.data);

    if (existingCsr) {
      const normalizedCsr = normalizeCsr(existingCsr);
      setCsrId(normalizedCsr.id);
      setFormData(normalizedCsr);
      return;
    }

    setCsrId(null);
    setFormData(createBlankCsrForm());
  };

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      try {
        await loadCsrData();
      } catch (err) {
        if (isMounted) {
          setLoadError(err.response?.data?.message || err.message || "Failed to load CSR page.");
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

  const fetchCsrPage = async () => {
    setIsLoading(true);
    setLoadError("");

    try {
      await loadCsrData();
    } catch (err) {
      setLoadError(err.response?.data?.message || err.message || "Failed to load CSR page.");
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
      const payload = buildCsrPayload(formData, toUploadPath);

      const response = isEdit
        ? await axios.put(`${CSR_ENDPOINT}/${csrId}`, payload, { headers: getAuthHeaders() })
        : await axios.post(CSR_ENDPOINT, payload, { headers: getAuthHeaders() });

      const savedCsr = getResponseRecord(response.data);

      if (savedCsr) {
        const normalizedCsr = normalizeCsr(savedCsr);
        setCsrId(normalizedCsr.id ?? csrId);
        setFormData(normalizedCsr);
      }

      setSubmitSuccess(isEdit ? "CSR page updated." : "CSR page created.");
    } catch (err) {
      setSubmitError(err.response?.data?.message || err.message || "Failed to save CSR page.");
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
            <h1 className="text-3xl font-black text-slate-950">CSR Page</h1>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">
              Single Page
            </span>
          </div>
          <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-500">
            Manage the public CSR page banner, intro copy, project details, and image galleries.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/csr"
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
            onClick={fetchCsrPage}
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
          <p className="text-sm font-semibold">Loading CSR page data...</p>
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
                <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">
                  Banner &amp; Intro
                </h2>
                <div className="grid gap-5">
                  <ImageField
                    label="Banner Image"
                    name="banner_image"
                    value={formData.banner_image}
                    onChange={handleChange}
                    helperText="Full-width hero background image."
                  />
                  <Input
                    label="Intro Title"
                    name="intro_title"
                    value={formData.intro_title}
                    onChange={handleChange}
                    placeholder="e.g. Securing the Future. Empowering Communities."
                  />
                  <RichTextEditor
                    label="Intro Description"
                    name="intro_description"
                    value={formData.intro_description}
                    onChange={handleChange}
                    placeholder="Introductory copy shown alongside the intro images."
                  />
                </div>

                <div className="space-y-4">
                  <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">
                    Intro Images
                  </h2>
                  <p className="text-sm font-semibold leading-6 text-slate-500">
                    Images shown fading in and out beside the intro copy.
                  </p>

                  {formData.intro_images.length === 0 && (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center text-sm font-semibold text-slate-400">
                      No intro images yet. Add one below.
                    </div>
                  )}

                  <div className="space-y-4">
                    {formData.intro_images.map((item, index) => (
                      <ImageRepeaterCard
                        key={item.id}
                        item={item}
                        index={index}
                        total={formData.intro_images.length}
                        label="Intro Image"
                        onChange={(nextItem) => updateListItem("intro_images", item.id, nextItem)}
                        onMove={(direction) => moveListItem("intro_images", index, direction)}
                        onRemove={() => removeListItem("intro_images", item.id)}
                      />
                    ))}
                  </div>

                  <Button
                    type="button"
                    variant="secondary"
                    icon={<Plus className="h-4 w-4" />}
                    onClick={() => addListItem("intro_images", createCsrImage)}
                  >
                    Add Intro Image
                  </Button>
                </div>

                <div className="space-y-4">
                  <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">
                    Slider Gallery
                  </h2>
                  <p className="text-sm font-semibold leading-6 text-slate-500">
                    Images rendered in the CSR gallery carousel.
                  </p>

                  {formData.slider_images.length === 0 && (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center text-sm font-semibold text-slate-400">
                      No slider images yet. Add one below.
                    </div>
                  )}

                  <div className="space-y-4">
                    {formData.slider_images.map((item, index) => (
                      <ImageRepeaterCard
                        key={item.id}
                        item={item}
                        index={index}
                        total={formData.slider_images.length}
                        label="Slider Image"
                        onChange={(nextItem) => updateListItem("slider_images", item.id, nextItem)}
                        onMove={(direction) => moveListItem("slider_images", index, direction)}
                        onRemove={() => removeListItem("slider_images", item.id)}
                      />
                    ))}
                  </div>

                  <Button
                    type="button"
                    variant="secondary"
                    icon={<Plus className="h-4 w-4" />}
                    onClick={() => addListItem("slider_images", createCsrImage)}
                  >
                    Add Slider Image
                  </Button>
                </div>

                <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">
                  Project
                </h2>
                <div className="grid gap-5">
                  <Input
                    label="Project Title"
                    name="project_title"
                    value={formData.project_title}
                    onChange={handleChange}
                    placeholder="e.g. Project Sunshine - The Build-Operate-Run (BOR) Methodology"
                  />
                  <RichTextEditor
                    label="Project Description"
                    name="project_description"
                    value={formData.project_description}
                    onChange={handleChange}
                    placeholder="Full project description, including any impact highlights."
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
                    placeholder="CSR | Assipl"
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
                  placeholder="Corporate social responsibility initiatives by Assipl."
                  rows={3}
                />

                <Textarea
                  label="Meta Keywords"
                  name="meta_keywords"
                  value={formData.meta_keywords}
                  onChange={handleChange}
                  placeholder="csr, corporate social responsibility, community"
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
                  placeholder="Accessible description for the CSR page images"
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
                <span className="block text-sm font-black text-slate-950">Active</span>
                <span className="mt-1 block text-xs font-semibold text-slate-500">
                  Marks this record as the active CSR content.
                </span>
              </span>
              <input
                type="checkbox"
                name="status"
                checked={formData.status}
                onChange={handleChange}
                className="h-5 w-5 rounded border-slate-300 accent-slate-950"
              />
            </label>

            <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <span>
                <span className="block text-sm font-black text-slate-950">Published</span>
                <span className="mt-1 block text-xs font-semibold text-slate-500">
                  Visible on the public CSR page.
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
              {isEdit ? "Update CSR Page" : "Create CSR Page"}
            </Button>
          </aside>
        </form>
      )}
    </div>
  );
}
