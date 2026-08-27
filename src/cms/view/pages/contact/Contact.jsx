import axios from "axios";
import {
  AtSign,
  Eye,
  ExternalLink,
  Globe2,
  MapPin,
  Phone,
  RefreshCw,
  Save,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaLinkedinIn } from "react-icons/fa";
import { Button, CmsToast, Input, Textarea } from "../../../components/ui/uiExports";
import { getAuthHeaders } from "../../../utils/auth";
import {
  buildContactPagePayload,
  CONTACT_PAGE_ENDPOINT,
  CONTACT_PAGE_LATEST_ENDPOINT,
  CONTACT_PAGE_SECTION_CONFIG,
  createBlankContactPageForm,
  formatDate,
  getContactPageSummary,
  getContactPageTitle,
  normalizeContactPage,
  normalizeContactPageCollection,
  validateContactPage,
} from "./contactPageUtils";

const SECTION_TAB_ICONS = {
  content: Eye,
  social: Globe2,
};

const getResponseRecord = (responseData) =>
  normalizeContactPageCollection(responseData?.data ?? responseData)[0] || null;

const FieldControl = ({ field, value, onChange, error = "", className = "" }) => {
  if (field.type === "textarea") {
    return (
      <Textarea
        label={field.label}
        name={field.name}
        value={value}
        onChange={onChange}
        placeholder={field.placeholder}
        rows={field.rows || 4}
        error={error}
        required={field.required}
        className={className}
      />
    );
  }

  return (
    <Input
      label={field.label}
      name={field.name}
      type={field.type}
      value={value}
      onChange={onChange}
      placeholder={field.placeholder}
      error={error}
      required={field.required}
      step={field.step}
      min={field.min}
      max={field.max}
      className={className}
    />
  );
};

const SectionEditor = ({ section, formData, onChange, errors }) => {
  const Icon = SECTION_TAB_ICONS[section.key] || Eye;

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white shadow-sm">
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-950">{section.label}</h2>
            <p className="mt-1 text-sm font-semibold leading-6 text-slate-500">
              {section.description}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 p-5 md:grid-cols-2">
        {section.fields.map((field) => (
          <FieldControl
            key={field.name}
            field={field}
            value={formData[field.name]}
            onChange={onChange}
            error={errors[field.name] || ""}
            className={field.colSpan === 2 ? "md:col-span-2" : ""}
          />
        ))}
      </div>
    </section>
  );
};

export default function ContactPage() {
  const [pageId, setPageId] = useState(null);
  const [originalPage, setOriginalPage] = useState(createBlankContactPageForm());
  const [formData, setFormData] = useState(createBlankContactPageForm());
  const [fieldErrors, setFieldErrors] = useState({});
  const [loadError, setLoadError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEdit = Boolean(pageId);

  const loadContactPageData = async () => {
    let existingPage = null;

    try {
      const latestResponse = await axios.get(CONTACT_PAGE_LATEST_ENDPOINT, {
        headers: getAuthHeaders(),
      });
      existingPage = getResponseRecord(latestResponse.data);
    } catch (latestError) {
      if (latestError.response?.status !== 404) {
        throw latestError;
      }
    }

    if (!existingPage) {
      const listResponse = await axios.get(CONTACT_PAGE_ENDPOINT, {
        headers: getAuthHeaders(),
      });
      existingPage = getResponseRecord(listResponse.data);
    }

    if (existingPage) {
      const normalizedPage = normalizeContactPage(existingPage);
      setPageId(normalizedPage.id);
      setOriginalPage(normalizedPage);
      setFormData(normalizedPage);
      return;
    }

    const blankPage = createBlankContactPageForm();
    setPageId(null);
    setOriginalPage(blankPage);
    setFormData(blankPage);
  };

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      try {
        await loadContactPageData();
      } catch (err) {
        if (isMounted) {
          setLoadError(
            err.response?.data?.message || err.message || "Failed to load contact page."
          );
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

  const fetchContactPage = async () => {
    setIsLoading(true);
    setLoadError("");

    try {
      await loadContactPageData();
    } catch (err) {
      setLoadError(
        err.response?.data?.message || err.message || "Failed to load contact page."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const previewLinks = useMemo(
    () =>
      [
        {
          key: "linkedin_link",
          label: "LinkedIn",
          href: formData.linkedin_link,
          icon: FaLinkedinIn,
          className: "text-[#0A66C2]",
        },
      ].filter((link) => String(link.href || "").trim()),
    [formData.linkedin_link]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setFieldErrors((current) => {
      if (!current[name]) return current;

      const nextErrors = { ...current };
      delete nextErrors[name];
      return nextErrors;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSubmitError("");
    setSubmitSuccess("");

    const nextErrors = validateContactPage(formData);
    setFieldErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSubmitError("Please fix the highlighted fields before saving.");
      return;
    }

    const payload = buildContactPagePayload(formData, originalPage, {
      partial: isEdit,
    });

    if (isEdit && Object.keys(payload).length === 0) {
      setSubmitSuccess("No changes to save.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = isEdit
        ? await axios.put(`${CONTACT_PAGE_ENDPOINT}/${pageId}`, payload, {
            headers: getAuthHeaders(),
          })
        : await axios.post(CONTACT_PAGE_ENDPOINT, payload, {
            headers: getAuthHeaders(),
          });

      const savedPage = getResponseRecord(response.data);

      if (savedPage) {
        const normalizedPage = normalizeContactPage(savedPage);
        setPageId(normalizedPage.id ?? pageId);
        setOriginalPage(normalizedPage);
        setFormData(normalizedPage);
      }

      setSubmitSuccess(isEdit ? "Contact page updated." : "Contact page created.");
    } catch (err) {
      setSubmitError(
        err.response?.data?.message || err.message || "Failed to save contact page."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const pageTitle = getContactPageTitle(formData);
  const pageSummary = getContactPageSummary(formData);
  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
            CMS Pages
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-black text-slate-950">Contact Page</h1>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">
              Single Page
            </span>
          </div>
          <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-500">
            Manage the public contact page content here. Required fields are validated,
            optional social links and coordinates are normalized, and updates only send the
            fields that changed.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/contact"
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
            onClick={fetchContactPage}
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
          <p className="text-sm font-semibold">Loading contact page data...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-950 text-white shadow-sm">
                  <Eye className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-black text-slate-950">
                    Contact Page Content
                  </h2>
                  <p className="mt-1 text-sm font-semibold leading-6 text-slate-500">
                    Keep the public contact page copy, address, email, phone, and social links
                    in sync from one record.
                  </p>
                </div>
              </div>
            </div>

            {CONTACT_PAGE_SECTION_CONFIG.map((section) => (
              <SectionEditor
                key={section.key}
                section={section}
                formData={formData}
                onChange={handleChange}
                errors={fieldErrors}
              />
            ))}
          </div>

          <aside className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm xl:sticky xl:top-24 xl:self-start">
            <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                Page Snapshot
              </p>
              <h2 className="text-xl font-black text-slate-950">{pageTitle}</h2>
              <p className="text-sm font-semibold leading-6 text-slate-500">
                {pageSummary}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                <MapPin className="h-4 w-4" />
                Contact Preview
              </div>

              <div className="mt-4 space-y-4 rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-950 text-white">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-950">Address</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {formData.address || "Address will appear here."}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-950 text-white">
                    <AtSign className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-950">Email</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {formData.email || "Email will appear here."}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-950 text-white">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-950">Phone</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {formData.phoneno || "Phone number will appear here."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                <Globe2 className="h-4 w-4" />
                Social Links
              </div>

              <div className="mt-4 grid gap-3">
                {previewLinks.length > 0 ? (
                  previewLinks.map((link) => {
                    const Icon = link.icon;

                    return (
                      <a
                        key={link.key}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                      >
                        <span className="flex items-center gap-3">
                          <Icon className={`h-4 w-4 ${link.className}`} />
                          {link.label}
                        </span>
                        <ExternalLink className="h-4 w-4 text-slate-400" />
                      </a>
                    );
                  })
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-6 text-sm font-semibold text-slate-400">
                    No social links set yet.
                  </div>
                )}
              </div>
            </div>

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

            <div className="rounded-xl border border-slate-200 bg-primary/5 p-4">
              <p className="text-sm font-semibold leading-6 text-slate-600">
                Required fields: contact_title, address, email, and phoneno. Optional social
                links and coordinates are sent as null when left blank.
              </p>
            </div>

            <Button
              type="submit"
              fullWidth
              isLoading={isSubmitting}
              icon={<Save className="h-4 w-4" />}
            >
              {isEdit ? "Update Contact Page" : "Create Contact Page"}
            </Button>
          </aside>
        </form>
      )}
    </div>
  );
}

