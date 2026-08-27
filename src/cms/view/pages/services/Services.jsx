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
  buildServicesPagePayload,
  createBlankServicesPageForm,
  createCoreProjectItem,
  createMaintenanceItem,
  createStrategicItem,
  formatDate,
  getResponseRecord,
  normalizeServicesPage,
  SERVICES_PAGE_ENDPOINT,
  toServicesPageUploadPath,
} from "./servicesPageUtils";

const getMediaUrl = (media) => {
  if (!media) return "";
  if (typeof media === "string") return media;

  return toServicesPageUploadPath(media.url || "");
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

function IconItemCard({ item, index, total, label, onChange, onMove, onRemove }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
      <RepeaterHeader index={index} total={total} label={label} onMove={onMove} onRemove={onRemove} />
      <div className="grid gap-4 md:grid-cols-2">
        <ImageField
          label="Icon"
          name={`icon-${item.id}`}
          value={item.icon}
          onChange={(event) => onChange({ ...item, icon: event.target.value })}
        />
        <Input
          label="Heading"
          name={`heading-${item.id}`}
          value={item.heading}
          onChange={(event) => onChange({ ...item, heading: event.target.value })}
          placeholder="e.g. Site Assessment & Design"
        />
      </div>
      <Textarea
        label="Description"
        name={`description-${item.id}`}
        value={item.description}
        onChange={(event) => onChange({ ...item, description: event.target.value })}
        placeholder="Short description for this item."
        rows={3}
        className="mt-4"
      />
    </div>
  );
}

function MaintenanceItemCard({ item, index, total, onChange, onMove, onRemove }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
      <RepeaterHeader index={index} total={total} label="Maintenance Item" onMove={onMove} onRemove={onRemove} />
      <div className="grid gap-4 md:grid-cols-2">
        <ImageField
          label="Image"
          name={`maintenance-image-${item.id}`}
          value={item.image}
          onChange={(event) => onChange({ ...item, image: event.target.value })}
        />
        <Input
          label="Heading"
          name={`maintenance-heading-${item.id}`}
          value={item.heading}
          onChange={(event) => onChange({ ...item, heading: event.target.value })}
          placeholder="e.g. Preventive Maintenance"
        />
      </div>
      <Textarea
        label="Description"
        name={`maintenance-description-${item.id}`}
        value={item.description}
        onChange={(event) => onChange({ ...item, description: event.target.value })}
        placeholder="Short description for this item."
        rows={3}
        className="mt-4"
      />
    </div>
  );
}

export default function CmsServicesPage() {
  const [pageId, setPageId] = useState(null);
  const [formData, setFormData] = useState(createBlankServicesPageForm());
  const [loadError, setLoadError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("content");
  const isEdit = Boolean(pageId);

  const loadServicesPageData = async () => {
    const response = await axios.get(SERVICES_PAGE_ENDPOINT, { headers: getAuthHeaders() });
    const existingPage = getResponseRecord(response.data);

    if (existingPage) {
      const normalizedPage = normalizeServicesPage(existingPage);
      setPageId(normalizedPage.id);
      setFormData(normalizedPage);
      return;
    }

    setPageId(null);
    setFormData(createBlankServicesPageForm());
  };

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      try {
        await loadServicesPageData();
      } catch (err) {
        if (isMounted) {
          setLoadError(err.response?.data?.message || err.message || "Failed to load Services page.");
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

  const fetchServicesPage = async () => {
    setIsLoading(true);
    setLoadError("");

    try {
      await loadServicesPageData();
    } catch (err) {
      setLoadError(err.response?.data?.message || err.message || "Failed to load Services page.");
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
      const payload = buildServicesPagePayload(formData, toServicesPageUploadPath);

      const response = isEdit
        ? await axios.put(`${SERVICES_PAGE_ENDPOINT}/${pageId}`, payload, { headers: getAuthHeaders() })
        : await axios.post(SERVICES_PAGE_ENDPOINT, payload, { headers: getAuthHeaders() });

      const savedPage = getResponseRecord(response.data);

      if (savedPage) {
        const normalizedPage = normalizeServicesPage(savedPage);
        setPageId(normalizedPage.id ?? pageId);
        setFormData(normalizedPage);
      }

      setSubmitSuccess(isEdit ? "Services page updated." : "Services page created.");
    } catch (err) {
      setSubmitError(err.response?.data?.message || err.message || "Failed to save Services page.");
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
            <h1 className="text-3xl font-black text-slate-950">Services Page</h1>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">
              Single Page
            </span>
          </div>
          <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-500">
            Manage the public Services landing page banner, strategic planning, core projects, and
            maintenance sections.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/service"
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
            onClick={fetchServicesPage}
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
          <p className="text-sm font-semibold">Loading Services page data...</p>
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
                <ImageField
                  label="Banner Image"
                  name="banner_image"
                  value={formData.banner_image}
                  onChange={handleChange}
                  helperText="Full-width hero background image."
                />

                <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">
                  Services Intro
                </h2>
                <div className="grid gap-5">
                  <Input
                    label="Services Title"
                    name="services_title"
                    value={formData.services_title}
                    onChange={handleChange}
                    placeholder="e.g. Enterprise Security Services"
                  />
                  <RichTextEditor
                    label="Services Description"
                    name="services_description"
                    value={formData.services_description}
                    onChange={handleChange}
                    placeholder="Intro copy for the services landing page."
                  />
                </div>

                <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">
                  Strategic Planning &amp; Design
                </h2>
                <div className="grid gap-5">
                  <ImageField
                    label="Strategic Image"
                    name="strategic_image"
                    value={formData.strategic_image}
                    onChange={handleChange}
                  />
                  <Input
                    label="Strategic Title"
                    name="strategic_title"
                    value={formData.strategic_title}
                    onChange={handleChange}
                    placeholder="e.g. Strategic Planning & Design"
                  />
                  <Input
                    label="Learn More Link"
                    name="learn_more_link"
                    value={formData.learn_more_link}
                    onChange={handleChange}
                    placeholder="/services/strategic-planning-design"
                  />
                </div>

                {formData.strategic_items.length === 0 && (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center text-sm font-semibold text-slate-400">
                    No strategic items yet. Add one below.
                  </div>
                )}

                <div className="space-y-4">
                  {formData.strategic_items.map((item, index) => (
                    <IconItemCard
                      key={item.id}
                      item={item}
                      index={index}
                      total={formData.strategic_items.length}
                      label="Strategic Item"
                      onChange={(nextItem) => updateListItem("strategic_items", item.id, nextItem)}
                      onMove={(direction) => moveListItem("strategic_items", index, direction)}
                      onRemove={() => removeListItem("strategic_items", item.id)}
                    />
                  ))}
                </div>

                <Button
                  type="button"
                  variant="secondary"
                  icon={<Plus className="h-4 w-4" />}
                  onClick={() => addListItem("strategic_items", createStrategicItem)}
                >
                  Add Strategic Item
                </Button>

                <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">
                  Core Project Execution
                </h2>
                <div className="grid gap-5">
                  <Input
                    label="Core Project Title"
                    name="core_project_title"
                    value={formData.core_project_title}
                    onChange={handleChange}
                    placeholder="e.g. Core Project Execution (SITC)"
                  />
                  <RichTextEditor
                    label="Core Project Description"
                    name="core_project_description"
                    value={formData.core_project_description}
                    onChange={handleChange}
                    placeholder="Description for the core project execution section."
                  />
                  <Input
                    label="Know More Link"
                    name="know_more_link"
                    value={formData.know_more_link}
                    onChange={handleChange}
                    placeholder="/services/core-project-execution-sitc"
                  />
                </div>

                {formData.core_projects.length === 0 && (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center text-sm font-semibold text-slate-400">
                    No core project items yet. Add one below.
                  </div>
                )}

                <div className="space-y-4">
                  {formData.core_projects.map((item, index) => (
                    <IconItemCard
                      key={item.id}
                      item={item}
                      index={index}
                      total={formData.core_projects.length}
                      label="Core Project Item"
                      onChange={(nextItem) => updateListItem("core_projects", item.id, nextItem)}
                      onMove={(direction) => moveListItem("core_projects", index, direction)}
                      onRemove={() => removeListItem("core_projects", item.id)}
                    />
                  ))}
                </div>

                <Button
                  type="button"
                  variant="secondary"
                  icon={<Plus className="h-4 w-4" />}
                  onClick={() => addListItem("core_projects", createCoreProjectItem)}
                >
                  Add Core Project Item
                </Button>

                <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">
                  Maintenance
                </h2>
                <div className="grid gap-5">
                  <Input
                    label="Maintenance Title"
                    name="maintenance_title"
                    value={formData.maintenance_title}
                    onChange={handleChange}
                    placeholder="e.g. Maintenance & Support"
                  />
                  <Input
                    label="Read More Link"
                    name="read_more_link"
                    value={formData.read_more_link}
                    onChange={handleChange}
                    placeholder="/services/maintenance"
                  />
                </div>

                {formData.maintenance_items.length === 0 && (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center text-sm font-semibold text-slate-400">
                    No maintenance items yet. Add one below.
                  </div>
                )}

                <div className="space-y-4">
                  {formData.maintenance_items.map((item, index) => (
                    <MaintenanceItemCard
                      key={item.id}
                      item={item}
                      index={index}
                      total={formData.maintenance_items.length}
                      onChange={(nextItem) => updateListItem("maintenance_items", item.id, nextItem)}
                      onMove={(direction) => moveListItem("maintenance_items", index, direction)}
                      onRemove={() => removeListItem("maintenance_items", item.id)}
                    />
                  ))}
                </div>

                <Button
                  type="button"
                  variant="secondary"
                  icon={<Plus className="h-4 w-4" />}
                  onClick={() => addListItem("maintenance_items", createMaintenanceItem)}
                >
                  Add Maintenance Item
                </Button>
              </div>
            ) : (
              <div className="space-y-6 p-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <Input
                    label="Meta Title"
                    name="meta_title"
                    value={formData.meta_title}
                    onChange={handleChange}
                    placeholder="Services | Assipl"
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
                  rows={3}
                />

                <Textarea
                  label="Meta Keywords"
                  name="meta_keywords"
                  value={formData.meta_keywords}
                  onChange={handleChange}
                  placeholder="enterprise security services, sitc, maintenance"
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
                  placeholder="Accessible description for the Services page images"
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
                  Visible on the public Services page.
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
              {isEdit ? "Update Services Page" : "Create Services Page"}
            </Button>
          </aside>
        </form>
      )}
    </div>
  );
}
