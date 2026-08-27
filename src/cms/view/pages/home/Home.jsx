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
  Users,
  Video,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, CmsMediaSelect, Input, RichTextEditor, Select, Textarea } from "../../../components/ui/uiExports";
import { getAuthHeaders } from "../../../utils/auth";
import {
  buildHomePayload,
  createBlankHomeForm,
  createClientLogoItem,
  createLocationItem,
  createLogoItem,
  createServiceItem,
  createStatItem,
  createTestimonialItem,
  formatDate,
  getResponseRecord,
  HOME_ENDPOINT,
  normalizeHome,
} from "./homePageUtils";

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

const VideoField = ({ label, name, value, onChange, helperText }) => (
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
    allowedType="video"
    accept="video/mp4,video/webm"
    uploadHint="MP4 or WEBM up to 20MB"
    helperText={helperText}
  />
);

const TABS = [
  { key: "hero", label: "Hero", icon: LayoutList },
  { key: "partners", label: "Partners", icon: Users },
  { key: "about", label: "About", icon: ImageIcon },
  { key: "video", label: "Video", icon: Video },
  { key: "clients", label: "Clients", icon: Users },
  { key: "services", label: "Services", icon: LayoutList },
  { key: "nationwide", label: "Nationwide", icon: MapPin },
  { key: "audit", label: "Audit CTA", icon: ImageIcon },
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

export default function CmsHomePage() {
  const [homeId, setHomeId] = useState(null);
  const [formData, setFormData] = useState(createBlankHomeForm());
  const [loadError, setLoadError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("hero");
  const isEdit = Boolean(homeId);

  const loadHomeData = async () => {
    const response = await axios.get(HOME_ENDPOINT, { headers: getAuthHeaders() });
    const existingHome = getResponseRecord(response.data);

    if (existingHome) {
      const normalizedHome = normalizeHome(existingHome);
      setHomeId(normalizedHome.id);
      setFormData(normalizedHome);
      return;
    }

    setHomeId(null);
    setFormData(createBlankHomeForm());
  };

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      try {
        await loadHomeData();
      } catch (err) {
        if (isMounted) {
          setLoadError(err.response?.data?.message || err.message || "Failed to load Home page.");
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

  const fetchHomePage = async () => {
    setIsLoading(true);
    setLoadError("");

    try {
      await loadHomeData();
    } catch (err) {
      setLoadError(err.response?.data?.message || err.message || "Failed to load Home page.");
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
      const payload = buildHomePayload(formData, toUploadPath);

      const response = isEdit
        ? await axios.put(`${HOME_ENDPOINT}/${homeId}`, payload, { headers: getAuthHeaders() })
        : await axios.post(HOME_ENDPOINT, payload, { headers: getAuthHeaders() });

      const savedHome = getResponseRecord(response.data);

      if (savedHome) {
        const normalizedHome = normalizeHome(savedHome);
        setHomeId(normalizedHome.id ?? homeId);
        setFormData(normalizedHome);
      }

      setSubmitSuccess(isEdit ? "Home page updated." : "Home page created.");
    } catch (err) {
      setSubmitError(err.response?.data?.message || err.message || "Failed to save Home page.");
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
            <h1 className="text-3xl font-black text-slate-950">Home Page</h1>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">
              Single Page
            </span>
          </div>
          <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-500">
            Manage every section of the public home page — hero, partners, about, video, clients, services,
            nationwide map, and the audit CTA.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/"
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
            onClick={fetchHomePage}
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
          <p className="text-sm font-semibold">Loading Home page data...</p>
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
                      helperText="Full-width hero background image."
                    />
                    <div className="grid gap-5 md:grid-cols-2">
                      <Input
                        label="Title Line 1"
                        name="hero_title_line1"
                        value={formData.hero_title_line1}
                        onChange={handleChange}
                        placeholder="e.g. Automation Systems"
                      />
                      <Input
                        label="Title Line 2"
                        name="hero_title_line2"
                        value={formData.hero_title_line2}
                        onChange={handleChange}
                        placeholder="e.g. and Solutions"
                      />
                    </div>
                    <Textarea
                      label="Subtitle"
                      name="hero_subtitle"
                      value={formData.hero_subtitle}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Integrated Security Solutions for BFSI, IT Parks, Industries, and Critical Infrastructure."
                    />
                    <Input
                      label="CTA Button Label"
                      name="hero_cta_label"
                      value={formData.hero_cta_label}
                      onChange={handleChange}
                      placeholder="Consult an Integration Expert"
                    />
                  </div>

                  <RepeaterShell
                    title="Stat Bullets"
                    description="Short highlight stats shown as a bulleted list on the hero."
                    items={formData.hero_stats}
                    emptyLabel="No stats yet. Add one below."
                    onAdd={() => addListItem("hero_stats", createStatItem)}
                  >
                    {formData.hero_stats.map((item, index) => (
                      <RepeaterCardShell
                        key={item.id}
                        index={index}
                        total={formData.hero_stats.length}
                        label="Stat"
                        onMove={(direction) => moveListItem("hero_stats", index, direction)}
                        onRemove={() => removeListItem("hero_stats", item.id)}
                      >
                        <Input
                          label="Value"
                          value={item.value}
                          onChange={(event) =>
                            updateListItem("hero_stats", item.id, { ...item, value: event.target.value })
                          }
                          placeholder="e.g. 15+ Years Experience"
                        />
                      </RepeaterCardShell>
                    ))}
                  </RepeaterShell>
                </>
              )}

              {activeTab === "partners" && (
                <>
                  <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">Partners Strip</h2>
                  <Input
                    label="Heading"
                    name="partners_heading"
                    value={formData.partners_heading}
                    onChange={handleChange}
                    placeholder="Powered by the World's Leading Manufacturers"
                  />

                  <RepeaterShell
                    title="Manufacturer Logos"
                    items={formData.partners_logos}
                    emptyLabel="No logos yet. Add one below."
                    onAdd={() => addListItem("partners_logos", createLogoItem)}
                  >
                    {formData.partners_logos.map((item, index) => (
                      <RepeaterCardShell
                        key={item.id}
                        index={index}
                        total={formData.partners_logos.length}
                        label="Logo"
                        onMove={(direction) => moveListItem("partners_logos", index, direction)}
                        onRemove={() => removeListItem("partners_logos", item.id)}
                      >
                        <div className="grid gap-4 md:grid-cols-2">
                          <ImageField
                            label="Logo Image"
                            name={`partners-logo-${item.id}`}
                            value={item.image}
                            onChange={(event) =>
                              updateListItem("partners_logos", item.id, { ...item, image: event.target.value })
                            }
                          />
                          <Input
                            label="Alt Text"
                            value={item.alt}
                            onChange={(event) =>
                              updateListItem("partners_logos", item.id, { ...item, alt: event.target.value })
                            }
                            placeholder="e.g. Bosch"
                          />
                        </div>
                      </RepeaterCardShell>
                    ))}
                  </RepeaterShell>
                </>
              )}

              {activeTab === "about" && (
                <>
                  <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">About Section</h2>
                  <div className="grid gap-5">
                    <ImageField
                      label="Image"
                      name="about_image"
                      value={formData.about_image}
                      onChange={handleChange}
                    />
                    <Input
                      label="Heading"
                      name="about_heading"
                      value={formData.about_heading}
                      onChange={handleChange}
                      placeholder="Precision Engineering. Nationwide Support."
                    />
                    <RichTextEditor
                      label="Description"
                      name="about_description"
                      value={formData.about_description}
                      onChange={handleChange}
                    />
                    <div className="grid gap-5 md:grid-cols-2">
                      <Input
                        label="CTA Label"
                        name="about_cta_label"
                        value={formData.about_cta_label}
                        onChange={handleChange}
                        placeholder="Know More"
                      />
                      <Input
                        label="CTA Link"
                        name="about_cta_href"
                        value={formData.about_cta_href}
                        onChange={handleChange}
                        placeholder="/about"
                      />
                    </div>
                  </div>
                </>
              )}

              {activeTab === "video" && (
                <>
                  <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">Video Section</h2>
                  <VideoField
                    label="Background Video"
                    name="video_url"
                    value={formData.video_url}
                    onChange={handleChange}
                    helperText="Upload the full-bleed autoplay video shown on the home page."
                  />
                </>
              )}

              {activeTab === "clients" && (
                <>
                  <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">Clients Section</h2>
                  <Input
                    label="Heading"
                    name="clients_heading"
                    value={formData.clients_heading}
                    onChange={handleChange}
                    placeholder="Major Clients"
                  />

                  <RepeaterShell
                    title="Testimonials"
                    items={formData.testimonials}
                    emptyLabel="No testimonials yet. Add one below."
                    onAdd={() => addListItem("testimonials", createTestimonialItem)}
                  >
                    {formData.testimonials.map((item, index) => (
                      <RepeaterCardShell
                        key={item.id}
                        index={index}
                        total={formData.testimonials.length}
                        label="Testimonial"
                        onMove={(direction) => moveListItem("testimonials", index, direction)}
                        onRemove={() => removeListItem("testimonials", item.id)}
                      >
                        <div className="grid gap-4">
                          <Textarea
                            label="Quote"
                            value={item.quote}
                            onChange={(event) =>
                              updateListItem("testimonials", item.id, { ...item, quote: event.target.value })
                            }
                            rows={3}
                          />
                          <div className="grid gap-4 md:grid-cols-2">
                            <Input
                              label="Company"
                              value={item.company}
                              onChange={(event) =>
                                updateListItem("testimonials", item.id, { ...item, company: event.target.value })
                              }
                            />
                            <ImageField
                              label="Company Logo"
                              name={`testimonial-logo-${item.id}`}
                              value={item.logo}
                              onChange={(event) =>
                                updateListItem("testimonials", item.id, { ...item, logo: event.target.value })
                              }
                            />
                          </div>
                        </div>
                      </RepeaterCardShell>
                    ))}
                  </RepeaterShell>

                  <RepeaterShell
                    title="Client Logo Carousel"
                    items={formData.client_logos}
                    emptyLabel="No client logos yet. Add one below."
                    onAdd={() => addListItem("client_logos", createClientLogoItem)}
                  >
                    {formData.client_logos.map((item, index) => (
                      <RepeaterCardShell
                        key={item.id}
                        index={index}
                        total={formData.client_logos.length}
                        label="Client"
                        onMove={(direction) => moveListItem("client_logos", index, direction)}
                        onRemove={() => removeListItem("client_logos", item.id)}
                      >
                        <div className="grid gap-4 md:grid-cols-2">
                          <Input
                            label="Client Name"
                            value={item.name}
                            onChange={(event) =>
                              updateListItem("client_logos", item.id, { ...item, name: event.target.value })
                            }
                          />
                          <ImageField
                            label="Logo"
                            name={`client-logo-${item.id}`}
                            value={item.logo}
                            onChange={(event) =>
                              updateListItem("client_logos", item.id, { ...item, logo: event.target.value })
                            }
                          />
                        </div>
                      </RepeaterCardShell>
                    ))}
                  </RepeaterShell>
                </>
              )}

              {activeTab === "services" && (
                <>
                  <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">Services Section</h2>
                  <div className="grid gap-5">
                    <Input
                      label="Heading"
                      name="services_heading"
                      value={formData.services_heading}
                      onChange={handleChange}
                      placeholder="End-to-End Integration Services"
                    />
                    <Textarea
                      label="Description"
                      name="services_description"
                      value={formData.services_description}
                      onChange={handleChange}
                      rows={3}
                    />
                    <ImageField
                      label="Image"
                      name="services_image"
                      value={formData.services_image}
                      onChange={handleChange}
                    />
                    <div className="grid gap-5 md:grid-cols-2">
                      <Input
                        label="CTA Label"
                        name="services_cta_label"
                        value={formData.services_cta_label}
                        onChange={handleChange}
                        placeholder="Explore Our Services"
                      />
                      <Input
                        label="CTA Link"
                        name="services_cta_href"
                        value={formData.services_cta_href}
                        onChange={handleChange}
                        placeholder="/service"
                      />
                    </div>
                  </div>

                  <RepeaterShell
                    title="Service List"
                    description="Displayed as an expandable accordion. Order here controls display order."
                    items={formData.services}
                    emptyLabel="No services yet. Add one below."
                    onAdd={() => addListItem("services", createServiceItem)}
                  >
                    {formData.services.map((item, index) => (
                      <RepeaterCardShell
                        key={item.id}
                        index={index}
                        total={formData.services.length}
                        label={`Service ${String(index + 1).padStart(2, "0")}`}
                        onMove={(direction) => moveListItem("services", index, direction)}
                        onRemove={() => removeListItem("services", item.id)}
                      >
                        <div className="grid gap-4">
                          <Input
                            label="Title"
                            value={item.title}
                            onChange={(event) =>
                              updateListItem("services", item.id, { ...item, title: event.target.value })
                            }
                          />
                          <Textarea
                            label="Description"
                            value={item.description}
                            onChange={(event) =>
                              updateListItem("services", item.id, { ...item, description: event.target.value })
                            }
                            rows={3}
                          />
                        </div>
                      </RepeaterCardShell>
                    ))}
                  </RepeaterShell>
                </>
              )}

              {activeTab === "nationwide" && (
                <>
                  <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">
                    Nationwide Section
                  </h2>
                  <div className="grid gap-5">
                    <Input
                      label="Heading"
                      name="nationwide_heading"
                      value={formData.nationwide_heading}
                      onChange={handleChange}
                      placeholder="Nationwide Scale. Localized Response."
                    />
                    <Textarea
                      label="Description"
                      name="nationwide_description"
                      value={formData.nationwide_description}
                      onChange={handleChange}
                      rows={3}
                    />
                  </div>

                  <RepeaterShell
                    title="Map Locations"
                    description="Longitude / latitude coordinates plotted on the India map."
                    items={formData.locations}
                    emptyLabel="No locations yet. Add one below."
                    onAdd={() => addListItem("locations", createLocationItem)}
                  >
                    {formData.locations.map((item, index) => (
                      <RepeaterCardShell
                        key={item.id}
                        index={index}
                        total={formData.locations.length}
                        label="Location"
                        onMove={(direction) => moveListItem("locations", index, direction)}
                        onRemove={() => removeListItem("locations", item.id)}
                      >
                        <div className="grid gap-4 md:grid-cols-4">
                          <Input
                            label="Name"
                            value={item.name}
                            onChange={(event) =>
                              updateListItem("locations", item.id, { ...item, name: event.target.value })
                            }
                          />
                          <Input
                            label="Longitude"
                            type="number"
                            step="any"
                            value={item.lon}
                            onChange={(event) =>
                              updateListItem("locations", item.id, { ...item, lon: event.target.value })
                            }
                          />
                          <Input
                            label="Latitude"
                            type="number"
                            step="any"
                            value={item.lat}
                            onChange={(event) =>
                              updateListItem("locations", item.id, { ...item, lat: event.target.value })
                            }
                          />
                          <label className="flex items-center gap-2 self-end pb-2 text-sm font-bold text-slate-600">
                            <input
                              type="checkbox"
                              checked={item.hq}
                              onChange={(event) =>
                                updateListItem("locations", item.id, { ...item, hq: event.target.checked })
                              }
                              className="h-4 w-4 rounded border-slate-300 accent-slate-950"
                            />
                            HQ
                          </label>
                        </div>
                      </RepeaterCardShell>
                    ))}
                  </RepeaterShell>
                </>
              )}

              {activeTab === "audit" && (
                <>
                  <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">
                    Infrastructure Audit CTA
                  </h2>
                  <div className="grid gap-5">
                    <ImageField
                      label="Background Image"
                      name="audit_background_image"
                      value={formData.audit_background_image}
                      onChange={handleChange}
                    />
                    <Input
                      label="Heading"
                      name="audit_heading"
                      value={formData.audit_heading}
                      onChange={handleChange}
                      placeholder="Initiate an Infrastructure Audit"
                    />
                    <Textarea
                      label="Description"
                      name="audit_description"
                      value={formData.audit_description}
                      onChange={handleChange}
                      rows={3}
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
                      placeholder="Home | Assipl"
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
                    placeholder="Integrated security solutions for BFSI, IT Parks, Industries, and Critical Infrastructure."
                    rows={3}
                  />

                  <Textarea
                    label="Meta Keywords"
                    name="meta_keywords"
                    value={formData.meta_keywords}
                    onChange={handleChange}
                    placeholder="security integration, cctv, access control, fire detection"
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
                    placeholder="Accessible description for the home page hero image"
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
                  Marks this record as the active Home page content.
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
              {isEdit ? "Update Home Page" : "Create Home Page"}
            </Button>
          </aside>
        </form>
      )}
    </div>
  );
}
