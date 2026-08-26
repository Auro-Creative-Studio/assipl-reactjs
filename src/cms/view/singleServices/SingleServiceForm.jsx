import axios from "axios";
import { ArrowDown, ArrowLeft, ArrowUp, Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  CmsMediaSelect,
  Input,
  RichTextEditor,
  Textarea,
} from "../../components/ui/uiExports";
import { getAuthHeaders } from "../../utils/auth";

const API_ROOT = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api"
).replace(/\/$/, "");

const SERVICE_ENDPOINT = `${API_ROOT}/single-services`;

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

const createItemId = () => `item-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const createAdvantage = () => ({ id: createItemId(), title: "", description: "", status: true });
const createModel = () => ({ id: createItemId(), title: "", image: "", description: "", status: true });

const initialForm = {
  title: "",
  banner_title: "",
  banner_image: "",
  breadcrumb_title: "",
  featured_image: "",
  overview_title: "",
  overview_description: "",
  service_advantages_title: "",
  service_advantages_description: "",
  service_models_title: "",
  service_models_description: "",
  cta_title: "",
  cta_description: "",
  cta_image: "",
  status: true,
  advantages: [],
  models: [],
};

const normalizeAdvantages = (items) => {
  if (!Array.isArray(items)) return [];

  return items
    .slice()
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((item) => ({
      id: item.id || createItemId(),
      title: item.title || "",
      description: item.description || "",
      status: item.status === undefined ? true : Boolean(item.status),
    }));
};

const normalizeModels = (items) => {
  if (!Array.isArray(items)) return [];

  return items
    .slice()
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((item) => ({
      id: item.id || createItemId(),
      title: item.title || "",
      image: item.image || "",
      description: item.description || "",
      status: item.status === undefined ? true : Boolean(item.status),
    }));
};

const normalizeForm = (service = {}) => ({
  title: service.title || "",
  banner_title: service.banner_title || "",
  banner_image: service.banner_image || "",
  breadcrumb_title: service.breadcrumb_title || "",
  featured_image: service.featured_image || "",
  overview_title: service.overview_title || "",
  overview_description: service.overview_description || "",
  service_advantages_title: service.service_advantages_title || "",
  service_advantages_description: service.service_advantages_description || "",
  service_models_title: service.service_models_title || "",
  service_models_description: service.service_models_description || "",
  cta_title: service.cta_title || "",
  cta_description: service.cta_description || "",
  cta_image: service.cta_image || "",
  status: service.status === undefined ? true : Boolean(service.status),
  advantages: normalizeAdvantages(service.advantages),
  models: normalizeModels(service.models),
});

const buildPayload = (formData) => ({
  title: formData.title.trim(),
  banner_title: formData.banner_title.trim() || null,
  banner_image: toUploadPath(formData.banner_image) || null,
  breadcrumb_title: formData.breadcrumb_title.trim() || null,
  featured_image: toUploadPath(formData.featured_image) || null,
  overview_title: formData.overview_title.trim() || null,
  overview_description: formData.overview_description.trim() || null,
  service_advantages_title: formData.service_advantages_title.trim() || null,
  service_advantages_description: formData.service_advantages_description.trim() || null,
  service_models_title: formData.service_models_title.trim() || null,
  service_models_description: formData.service_models_description.trim() || null,
  cta_title: formData.cta_title.trim() || null,
  cta_description: formData.cta_description.trim() || null,
  cta_image: toUploadPath(formData.cta_image) || null,
  status: formData.status,
  advantages: formData.advantages.map((item, index) => ({
    id: item.id,
    title: item.title.trim(),
    description: item.description.trim(),
    sort_order: index,
    status: item.status,
  })),
  models: formData.models.map((item, index) => ({
    id: item.id,
    title: item.title.trim(),
    image: toUploadPath(item.image) || null,
    description: item.description,
    sort_order: index,
    status: item.status,
  })),
});

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

function RepeaterHeader({ index, total, label, status, onToggleStatus, onMove, onRemove }) {
  return (
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
            checked={status}
            onChange={onToggleStatus}
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
  );
}

function AdvantageCard({ item, index, total, onChange, onMove, onRemove }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
      <RepeaterHeader
        index={index}
        total={total}
        label="Advantage"
        status={item.status}
        onToggleStatus={(event) => onChange({ ...item, status: event.target.checked })}
        onMove={onMove}
        onRemove={onRemove}
      />

      <div className="space-y-4">
        <Input
          label="Advantage Title"
          name={`advantage-title-${item.id}`}
          value={item.title}
          onChange={(event) => onChange({ ...item, title: event.target.value })}
          placeholder="e.g. Faster Time-to-Hire"
        />

        <Textarea
          label="Advantage Description"
          name={`advantage-description-${item.id}`}
          value={item.description}
          onChange={(event) => onChange({ ...item, description: event.target.value })}
          placeholder="Short one or two line benefit statement."
          rows={2}
        />
      </div>
    </div>
  );
}

function ModelCard({ item, index, total, onChange, onMove, onRemove }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
      <RepeaterHeader
        index={index}
        total={total}
        label="Engagement Model"
        status={item.status}
        onToggleStatus={(event) => onChange({ ...item, status: event.target.checked })}
        onMove={onMove}
        onRemove={onRemove}
      />

      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Model Title"
            name={`model-title-${item.id}`}
            value={item.title}
            onChange={(event) => onChange({ ...item, title: event.target.value })}
            placeholder="e.g. Full RPO"
          />
          <ImageField
            label="Model Image"
            name={`model-image-${item.id}`}
            value={item.image}
            onChange={(event) => onChange({ ...item, image: event.target.value })}
            helperText="Shown above the model title on the service page."
          />
        </div>

        <RichTextEditor
          label="Model Description"
          name={`model-description-${item.id}`}
          value={item.description}
          onChange={(event) => onChange({ ...item, description: event.target.value })}
          placeholder="Describe this engagement model."
        />
      </div>
    </div>
  );
}

export default function SingleServiceForm({ serviceId = null, mode = "create" }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loadError, setLoadError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isLoading, setIsLoading] = useState(Boolean(serviceId));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEdit = mode === "edit";

  useEffect(() => {
    const fetchFormData = async () => {
      setIsLoading(Boolean(serviceId));
      setLoadError("");

      try {
        if (serviceId) {
          const serviceResponse = await axios.get(`${SERVICE_ENDPOINT}/${serviceId}`, {
            headers: getAuthHeaders(),
          });
          setFormData(normalizeForm(serviceResponse.data?.data || {}));
        }
      } catch (err) {
        setLoadError(
          err.response?.data?.message || err.message || "Failed to load service data."
        );
      } finally {
        setIsLoading(false);
      }
    };

    void Promise.resolve().then(fetchFormData);
  }, [serviceId]);

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
      nextErrors.title = "Service title is required.";
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
        await axios.put(`${SERVICE_ENDPOINT}/${serviceId}`, payload, {
          headers: getAuthHeaders(),
        });
      } else {
        await axios.post(SERVICE_ENDPOINT, payload, {
          headers: getAuthHeaders(),
        });
      }

      navigate("/admin/single-services");
    } catch (err) {
      setSubmitError(
        err.response?.data?.message || err.message || "Failed to save service."
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
            CMS Single Services
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">
            {isEdit ? "Edit Service" : "Create Service"}
          </h1>
          <p className="mt-2 text-sm font-semibold text-slate-500">
            Manage the service detail page content, advantages, engagement models, and status.
          </p>
        </div>

        <Link to="/admin/single-services">
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
          <p className="text-sm font-semibold">Loading service data...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="grid gap-6 xl:grid-cols-[1fr_340px]">
            <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <Input
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Recruitment Process Outsourcing"
                error={errors.title}
                required
              />

              <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">
                Banner
              </h2>
              <div className="grid gap-5">
                <Input
                  label="Banner Title"
                  name="banner_title"
                  value={formData.banner_title}
                  onChange={handleChange}
                  placeholder="Heading shown on the hero background."
                />
                {/* <Input
                  label="Breadcrumb Title"
                  name="breadcrumb_title"
                  value={formData.breadcrumb_title}
                  onChange={handleChange}
                  placeholder="Short label shown in the breadcrumb trail."
                /> */}
              </div>
              <ImageField
                label="Banner Image"
                name="banner_image"
                value={formData.banner_image}
                onChange={handleChange}
                helperText="Full-width background behind the hero title."
              />

              <h2 className="pt-2 text-sm font-black uppercase tracking-[0.16em] text-slate-500">
                Overview
              </h2>
              <ImageField
                label="Featured Image"
                name="featured_image"
                value={formData.featured_image}
                onChange={handleChange}
                helperText="Large image at the top of the service detail content."
              />
              <Input
                label="Overview Title"
                name="overview_title"
                value={formData.overview_title}
                onChange={handleChange}
                placeholder="e.g. About Our RPO Services"
              />
              <RichTextEditor
                label="Overview Description"
                name="overview_description"
                value={formData.overview_description}
                onChange={handleChange}
                placeholder="Full overview content for the service detail page."
              />

              <h2 className="pt-2 text-sm font-black uppercase tracking-[0.16em] text-slate-500">
                Advantages
              </h2>
              <div className="grid gap-5 md:grid-cols-2">
                <Input
                  label="Advantages Section Title"
                  name="service_advantages_title"
                  value={formData.service_advantages_title}
                  onChange={handleChange}
                  placeholder="e.g. Why Choose Our RPO Model"
                />
                <Input
                  label="Advantages Section Description"
                  name="service_advantages_description"
                  value={formData.service_advantages_description}
                  onChange={handleChange}
                  placeholder="Key benefits of partnering with us"
                />
              </div>

              {formData.advantages.length === 0 && (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center text-sm font-semibold text-slate-400">
                  No advantages yet. Add one below.
                </div>
              )}

              <div className="space-y-4">
                {formData.advantages.map((item, index) => (
                  <AdvantageCard
                    key={item.id}
                    item={item}
                    index={index}
                    total={formData.advantages.length}
                    onChange={(nextItem) => updateListItem("advantages", item.id, nextItem)}
                    onMove={(direction) => moveListItem("advantages", index, direction)}
                    onRemove={() => removeListItem("advantages", item.id)}
                  />
                ))}
              </div>

              <Button
                type="button"
                variant="secondary"
                icon={<Plus className="h-4 w-4" />}
                onClick={() => addListItem("advantages", createAdvantage)}
              >
                Add Advantage
              </Button>

              <h2 className="pt-2 text-sm font-black uppercase tracking-[0.16em] text-slate-500">
                Engagement Models
              </h2>
              <div className="grid gap-5 md:grid-cols-2">
                <Input
                  label="Models Section Title"
                  name="service_models_title"
                  value={formData.service_models_title}
                  onChange={handleChange}
                  placeholder="e.g. Our Engagement Models"
                />
                <Input
                  label="Models Section Description"
                  name="service_models_description"
                  value={formData.service_models_description}
                  onChange={handleChange}
                  placeholder="Flexible models tailored to your needs"
                />
              </div>

              {formData.models.length === 0 && (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center text-sm font-semibold text-slate-400">
                  No engagement models yet. Add one below.
                </div>
              )}

              <div className="space-y-4">
                {formData.models.map((item, index) => (
                  <ModelCard
                    key={item.id}
                    item={item}
                    index={index}
                    total={formData.models.length}
                    onChange={(nextItem) => updateListItem("models", item.id, nextItem)}
                    onMove={(direction) => moveListItem("models", index, direction)}
                    onRemove={() => removeListItem("models", item.id)}
                  />
                ))}
              </div>

              <Button
                type="button"
                variant="secondary"
                icon={<Plus className="h-4 w-4" />}
                onClick={() => addListItem("models", createModel)}
              >
                Add Engagement Model
              </Button>

              <h2 className="pt-2 text-sm font-black uppercase tracking-[0.16em] text-slate-500">
                Call To Action
              </h2>
              <Input
                label="CTA Title"
                name="cta_title"
                value={formData.cta_title}
                onChange={handleChange}
                placeholder="e.g. Ready to get started?"
              />
              <Textarea
                label="CTA Description"
                name="cta_description"
                value={formData.cta_description}
                onChange={handleChange}
                placeholder="Talk to our team today"
                rows={3}
              />
              <ImageField
                label="CTA Background Image"
                name="cta_image"
                value={formData.cta_image}
                onChange={handleChange}
                helperText="Background image behind the closing call-to-action."
              />
            </div>

            <aside className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm xl:sticky xl:top-24 xl:self-start">
              <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <span>
                  <span className="block text-sm font-black text-slate-950">Published</span>
                  <span className="mt-1 block text-xs font-semibold text-slate-500">
                    Visible through the public single-services API.
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

              <Button
                type="submit"
                fullWidth
                isLoading={isSubmitting}
                icon={<Save className="h-4 w-4" />}
              >
                {isEdit ? "Update Service" : "Save Service"}
              </Button>
            </aside>
          </section>
        </form>
      )}
    </div>
  );
}
