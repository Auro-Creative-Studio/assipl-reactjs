import axios from "axios";
import {
  ArrowDown,
  ArrowUp,
  ExternalLink,
  Globe,
  Image as ImageIcon,
  LayoutList,
  MapPin,
  Plus,
  RefreshCw,
  Save,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, CmsMediaSelect, Input, RichTextEditor, Select, Textarea } from "../../../components/ui/uiExports";
import { getAuthHeaders } from "../../../utils/auth";
import {
  buildProcessPayload,
  createBlankProcessForm,
  createPointItem,
  createStepItem,
  formatDate,
  getResponseRecord,
  normalizeProcess,
  PROCESS_ENDPOINT,
} from "./processPageUtils";

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

const TABS = [
  { key: "hero", label: "Hero", icon: ImageIcon },
  { key: "intro", label: "Intro", icon: LayoutList },
  { key: "steps", label: "Steps", icon: MapPin },
  { key: "cta", label: "CTA", icon: ImageIcon },
  { key: "metadata", label: "Metadata", icon: Globe },
];

function RepeaterShell({ title, description, items, emptyLabel, onAdd, children }) {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">{title}</h2>
      {description && <p className="text-sm font-semibold leading-6 text-slate-500">{description}</p>}

      {items.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center text-sm font-semibold text-slate-400">
          {emptyLabel}
        </div>
      )}

      <div className="space-y-4">{children}</div>

      <Button type="button" variant="secondary" icon={<Plus className="h-4 w-4" />} onClick={onAdd}>
        Add Item
      </Button>
    </div>
  );
}

function RepeaterCardShell({ index, total, label, onMove, onRemove, children }) {
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
      {children}
    </div>
  );
}

export default function CmsProcessPage() {
  const [processId, setProcessId] = useState(null);
  const [formData, setFormData] = useState(createBlankProcessForm());
  const [loadError, setLoadError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("hero");
  const isEdit = Boolean(processId);

  const loadProcessData = async () => {
    const response = await axios.get(PROCESS_ENDPOINT, { headers: getAuthHeaders() });
    const existingProcess = getResponseRecord(response.data);

    if (existingProcess) {
      const normalizedProcess = normalizeProcess(existingProcess);
      setProcessId(normalizedProcess.id);
      setFormData(normalizedProcess);
      return;
    }

    setProcessId(null);
    setFormData(createBlankProcessForm());
  };

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      try {
        await loadProcessData();
      } catch (err) {
        if (isMounted) {
          setLoadError(err.response?.data?.message || err.message || "Failed to load Process page.");
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

  const fetchProcessPage = async () => {
    setIsLoading(true);
    setLoadError("");

    try {
      await loadProcessData();
    } catch (err) {
      setLoadError(err.response?.data?.message || err.message || "Failed to load Process page.");
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

  const updateStep = (stepId, nextStep) => {
    setFormData((current) => ({
      ...current,
      steps: current.steps.map((step) => (step.id === stepId ? nextStep : step)),
    }));
  };

  const moveStep = (index, direction) => {
    setFormData((current) => {
      const steps = [...current.steps];
      const targetIndex = index + direction;

      if (targetIndex < 0 || targetIndex >= steps.length) return current;

      [steps[index], steps[targetIndex]] = [steps[targetIndex], steps[index]];

      return { ...current, steps };
    });
  };

  const removeStep = (stepId) => {
    setFormData((current) => ({
      ...current,
      steps: current.steps.filter((step) => step.id !== stepId),
    }));
  };

  const addStep = () => {
    setFormData((current) => ({
      ...current,
      steps: [...current.steps, createStepItem()],
    }));
  };

  const updatePoint = (step, pointId, nextPoint) => {
    updateStep(step.id, {
      ...step,
      points: step.points.map((point) => (point.id === pointId ? nextPoint : point)),
    });
  };

  const movePoint = (step, index, direction) => {
    const points = [...step.points];
    const targetIndex = index + direction;

    if (targetIndex < 0 || targetIndex >= points.length) return;

    [points[index], points[targetIndex]] = [points[targetIndex], points[index]];
    updateStep(step.id, { ...step, points });
  };

  const removePoint = (step, pointId) => {
    updateStep(step.id, { ...step, points: step.points.filter((point) => point.id !== pointId) });
  };

  const addPoint = (step) => {
    updateStep(step.id, { ...step, points: [...step.points, createPointItem()] });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSubmitError("");
    setSubmitSuccess("");
    setIsSubmitting(true);

    try {
      const payload = buildProcessPayload(formData, toUploadPath);

      const response = isEdit
        ? await axios.put(`${PROCESS_ENDPOINT}/${processId}`, payload, { headers: getAuthHeaders() })
        : await axios.post(PROCESS_ENDPOINT, payload, { headers: getAuthHeaders() });

      const savedProcess = getResponseRecord(response.data);

      if (savedProcess) {
        const normalizedProcess = normalizeProcess(savedProcess);
        setProcessId(normalizedProcess.id ?? processId);
        setFormData(normalizedProcess);
      }

      setSubmitSuccess(isEdit ? "Process page updated." : "Process page created.");
    } catch (err) {
      setSubmitError(err.response?.data?.message || err.message || "Failed to save Process page.");
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
            <h1 className="text-3xl font-black text-slate-950">Process Page</h1>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">
              Single Page
            </span>
          </div>
          <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-500">
            Manage the public Process page — hero, intro copy, the deployment timeline steps, and the closing CTA.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/process"
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
            onClick={fetchProcessPage}
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

      {submitSuccess && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
          {submitSuccess}
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white py-16 text-slate-500 shadow-sm">
          <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-slate-200 border-t-slate-950" />
          <p className="text-sm font-semibold">Loading Process page data...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[3fr_1fr]">
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-wrap border-b border-slate-200 px-5 pt-4">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex min-h-11 items-center gap-2 border-b-2 px-4 text-sm font-black transition ${
                    activeTab === tab.key
                      ? "border-primary text-primary"
                      : "border-transparent text-slate-500 hover:text-slate-950"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="space-y-6 p-5">
              {activeTab === "hero" && (
                <>
                  <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">Hero Section</h2>
                  <div className="grid gap-5">
                    <ImageField
                      label="Background Image"
                      name="hero_background_image"
                      value={formData.hero_background_image}
                      onChange={handleChange}
                    />
                    <Input
                      label="Title"
                      name="hero_title"
                      value={formData.hero_title}
                      onChange={handleChange}
                      placeholder="Process"
                    />
                  </div>
                </>
              )}

              {activeTab === "intro" && (
                <>
                  <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">Intro Section</h2>
                  <div className="grid gap-5">
                    <Input
                      label="Heading"
                      name="intro_heading"
                      value={formData.intro_heading}
                      onChange={handleChange}
                      placeholder="Engineered for Absolute Accountability"
                    />
                    <RichTextEditor
                      label="Description"
                      name="intro_description"
                      value={formData.intro_description}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}

              {activeTab === "steps" && (
                <RepeaterShell
                  title="Deployment Timeline Steps"
                  description="Each step renders with an icon, an image, a title, and a bulleted list of points. Order controls the timeline order."
                  items={formData.steps}
                  emptyLabel="No steps yet. Add one below."
                  onAdd={addStep}
                >
                  {formData.steps.map((step, index) => (
                    <RepeaterCardShell
                      key={step.id}
                      index={index}
                      total={formData.steps.length}
                      label={`Step ${index + 1}`}
                      onMove={(direction) => moveStep(index, direction)}
                      onRemove={() => removeStep(step.id)}
                    >
                      <div className="grid gap-4">
                        <Input
                          label="Title"
                          value={step.title}
                          onChange={(event) => updateStep(step.id, { ...step, title: event.target.value })}
                        />
                        <div className="grid gap-4 md:grid-cols-2">
                          <ImageField
                            label="Icon"
                            name={`step-icon-${step.id}`}
                            value={step.icon}
                            onChange={(event) => updateStep(step.id, { ...step, icon: event.target.value })}
                            helperText="Small round icon shown on the timeline marker."
                          />
                          <ImageField
                            label="Image"
                            name={`step-image-${step.id}`}
                            value={step.image}
                            onChange={(event) => updateStep(step.id, { ...step, image: event.target.value })}
                            helperText="Larger photo shown alongside the content card."
                          />
                        </div>

                        <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
                          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                            Bullet Points
                          </p>

                          {step.points.length === 0 && (
                            <p className="text-sm font-semibold text-slate-400">No points yet.</p>
                          )}

                          <div className="space-y-3">
                            {step.points.map((point, pointIndex) => (
                              <div
                                key={point.id}
                                className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 md:grid-cols-[1fr_2fr_auto]"
                              >
                                <Input
                                  label="Label"
                                  value={point.label}
                                  onChange={(event) =>
                                    updatePoint(step, point.id, { ...point, label: event.target.value })
                                  }
                                  placeholder="e.g. Site & Threat Audits:"
                                />
                                <Textarea
                                  label="Text"
                                  value={point.text}
                                  onChange={(event) =>
                                    updatePoint(step, point.id, { ...point, text: event.target.value })
                                  }
                                  rows={2}
                                />
                                <div className="flex items-end gap-2">
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="secondary"
                                    disabled={pointIndex === 0}
                                    onClick={() => movePoint(step, pointIndex, -1)}
                                    icon={<ArrowUp className="h-3.5 w-3.5" />}
                                    aria-label="Move up"
                                  />
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="secondary"
                                    disabled={pointIndex === step.points.length - 1}
                                    onClick={() => movePoint(step, pointIndex, 1)}
                                    icon={<ArrowDown className="h-3.5 w-3.5" />}
                                    aria-label="Move down"
                                  />
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="danger"
                                    onClick={() => removePoint(step, point.id)}
                                    icon={<Trash2 className="h-3.5 w-3.5" />}
                                    aria-label="Remove"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>

                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            icon={<Plus className="h-3.5 w-3.5" />}
                            onClick={() => addPoint(step)}
                          >
                            Add Point
                          </Button>
                        </div>
                      </div>
                    </RepeaterCardShell>
                  ))}
                </RepeaterShell>
              )}

              {activeTab === "cta" && (
                <>
                  <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">CTA Section</h2>
                  <div className="grid gap-5">
                    <ImageField
                      label="Background Image"
                      name="cta_background_image"
                      value={formData.cta_background_image}
                      onChange={handleChange}
                    />
                    <Input
                      label="Heading"
                      name="cta_heading"
                      value={formData.cta_heading}
                      onChange={handleChange}
                      placeholder="Experience Seamless Project Execution"
                    />
                    <Textarea
                      label="Description"
                      name="cta_description"
                      value={formData.cta_description}
                      onChange={handleChange}
                      rows={3}
                    />
                    <Input
                      label="Button Label"
                      name="cta_button_label"
                      value={formData.cta_button_label}
                      onChange={handleChange}
                      placeholder="Consult Our Engineering Team"
                    />
                  </div>
                </>
              )}

              {activeTab === "metadata" && (
                <>
                  <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">Metadata</h2>
                  <div className="grid gap-5 md:grid-cols-2">
                    <Input
                      label="Meta Title"
                      name="meta_title"
                      value={formData.meta_title}
                      onChange={handleChange}
                      placeholder="Process | Assipl"
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
                    placeholder="Our structured deployment process for enterprise security rollouts."
                    rows={3}
                  />

                  <Textarea
                    label="Meta Keywords"
                    name="meta_keywords"
                    value={formData.meta_keywords}
                    onChange={handleChange}
                    placeholder="deployment process, project execution, sitc"
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
                    placeholder="Accessible description for the process page hero image"
                  />

                  <ImageField
                    label="OG Image"
                    name="og_image"
                    value={formData.og_image}
                    onChange={handleChange}
                    helperText="Social sharing image."
                  />
                </>
              )}
            </div>
          </div>

          <aside className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm xl:sticky xl:top-24 xl:self-start">
            <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <span>
                <span className="block text-sm font-black text-slate-950">Active</span>
                <span className="mt-1 block text-xs font-semibold text-slate-500">
                  Marks this record as the active Process page content.
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

            {isEdit && formData.updated_at && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">Last Updated</p>
                <p className="mt-2 text-sm font-semibold text-slate-600">{formatDate(formData.updated_at)}</p>
              </div>
            )}

            <Button type="submit" fullWidth isLoading={isSubmitting} icon={<Save className="h-4 w-4" />}>
              {isEdit ? "Update Process Page" : "Create Process Page"}
            </Button>
          </aside>
        </form>
      )}
    </div>
  );
}
