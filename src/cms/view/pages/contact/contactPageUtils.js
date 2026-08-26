const API_ROOT = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api"
).replace(/\/$/, "");

export const CONTACT_PAGE_ENDPOINT = `${API_ROOT}/contact-page`;
export const CONTACT_PAGE_LATEST_ENDPOINT = `${CONTACT_PAGE_ENDPOINT}/latest`;

const CONTACT_PAGE_FIELD_CONFIG = [
  {
    name: "contact_title",
    label: "Contact Title",
    type: "text",
    placeholder: "Let's Turn Your Vision Into Impact",
    required: true,
    section: "content",
    colSpan: 2,
  },
  {
    name: "contact_description",
    label: "Contact Description",
    type: "textarea",
    placeholder: "Most ideas stay ideas. Tell us yours, and we'll build the strategy to make it real.",
    rows: 4,
    section: "content",
    colSpan: 2,
  },
  {
    name: "address",
    label: "Address",
    type: "textarea",
    placeholder: "147, Om Tower, 3rd Floor, Sankar Cinema Road, Angul-759122 (Odisha)",
    rows: 3,
    required: true,
    section: "content",
    colSpan: 2,
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "assipl@gmail.com",
    required: true,
    section: "content",
  },
  {
    name: "phoneno",
    label: "Phone Number",
    type: "tel",
    placeholder: "+91 82608 66388",
    required: true,
    section: "content",
  },
  {
    name: "facebook_link",
    label: "Facebook Link",
    type: "url",
    placeholder: "https://facebook.com/assipl",
    nullable: true,
    section: "social",
  },
  {
    name: "linkedin_link",
    label: "LinkedIn Link",
    type: "url",
    placeholder: "https://linkedin.com/company/assipl",
    nullable: true,
    section: "social",
  },
  {
    name: "instagram_link",
    label: "Instagram Link",
    type: "url",
    placeholder: "https://instagram.com/_assipl_",
    nullable: true,
    section: "social",
  },
  {
    name: "twitter_link",
    label: "X / Twitter Link",
    type: "url",
    placeholder: "https://x.com/assipl",
    nullable: true,
    section: "social",
  },
];

export const CONTACT_PAGE_SECTION_CONFIG = [
  {
    key: "content",
    label: "Page Content",
    description: "Headline, copy, and the primary contact details shown on the public page.",
    fields: CONTACT_PAGE_FIELD_CONFIG.filter((field) => field.section === "content"),
  },
  {
    key: "social",
    label: "Social Links",
    description: "Optional social profiles rendered on the contact page.",
    fields: CONTACT_PAGE_FIELD_CONFIG.filter((field) => field.section === "social"),
  },
];

const normalizeString = (value) => {
  if (value === null || value === undefined) return "";

  return String(value);
};

const parseCoordinateValue = (value) => {
  const textValue = normalizeString(value).trim();

  if (!textValue) return null;

  const parsedValue = Number(textValue);

  return Number.isFinite(parsedValue) ? parsedValue : null;
};

const isValidHttpUrl = (value) => {
  const textValue = normalizeString(value).trim();

  if (!textValue) return true;

  try {
    const parsedUrl = new URL(textValue);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch {
    return false;
  }
};

const serializeFieldValue = (field, value) => {
  const textValue = normalizeString(value).trim();

  if (field.type === "number") {
    const parsedValue = parseCoordinateValue(textValue);
    return parsedValue === null ? null : parsedValue;
  }

  if (field.nullable) {
    return textValue || null;
  }

  return textValue;
};

const compareFieldValue = (field, value) => {
  const serializedValue = serializeFieldValue(field, value);

  if (serializedValue === null || serializedValue === undefined) {
    return null;
  }

  return String(serializedValue);
};

const createBlankItem = () =>
  Object.fromEntries(CONTACT_PAGE_FIELD_CONFIG.map((field) => [field.name, ""]));

export const createBlankContactPageForm = () => ({
  id: null,
  created_at: "",
  updated_at: "",
  ...createBlankItem(),
});

export const normalizeContactPage = (page = {}) => {
  const normalized = {
    id: page.id ?? null,
    created_at: normalizeString(page.created_at),
    updated_at: normalizeString(page.updated_at),
  };

  CONTACT_PAGE_FIELD_CONFIG.forEach((field) => {
    if (field.type === "number") {
      const coordinateValue = parseCoordinateValue(page?.[field.name]);
      normalized[field.name] = coordinateValue === null ? "" : String(coordinateValue);
      return;
    }

    normalized[field.name] = normalizeString(page?.[field.name]);
  });

  return normalized;
};

export const normalizeContactPageCollection = (value) => {
  if (Array.isArray(value)) {
    return value.map((page) => normalizeContactPage(page));
  }

  if (value && typeof value === "object") {
    return [normalizeContactPage(value)];
  }

  return [];
};

export const buildContactPagePayload = (
  formData = {},
  originalData = null,
  { partial = false } = {}
) => {
  const payload = {};

  CONTACT_PAGE_FIELD_CONFIG.forEach((field) => {
    const nextValue = serializeFieldValue(field, formData[field.name]);

    if (partial && originalData) {
      const previousValue = compareFieldValue(field, originalData[field.name]);
      const comparableNextValue =
        nextValue === null || nextValue === undefined ? null : String(nextValue);

      if (comparableNextValue === previousValue) {
        return;
      }
    }

    payload[field.name] = nextValue;
  });

  return payload;
};

export const validateContactPage = (formData = {}) => {
  const errors = {};
  const requiredFields = ["contact_title", "address", "email", "phoneno"];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  requiredFields.forEach((fieldName) => {
    if (!normalizeString(formData[fieldName]).trim()) {
      const fieldLabel =
        CONTACT_PAGE_FIELD_CONFIG.find((field) => field.name === fieldName)?.label ||
        fieldName;
      errors[fieldName] = `${fieldLabel} is required.`;
    }
  });

  const emailValue = normalizeString(formData.email).trim();
  if (emailValue && !emailRegex.test(emailValue)) {
    errors.email = "Enter a valid email address.";
  }

  const phoneValue = normalizeString(formData.phoneno).trim();
  if (phoneValue && phoneValue.replace(/\D/g, "").length < 6) {
    errors.phoneno = "Enter a valid phone number.";
  }

  CONTACT_PAGE_FIELD_CONFIG.filter((field) => field.section === "social").forEach((field) => {
    const value = normalizeString(formData[field.name]).trim();
    if (value && !isValidHttpUrl(value)) {
      errors[field.name] = "Enter a valid URL starting with http:// or https://.";
    }
  });

  return errors;
};

export const formatDate = (value) => {
  if (!value) return "N/A";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
};

export const getContactPageTitle = (page = {}) =>
  normalizeString(page.contact_title).trim() ||
  (page.id ? `Contact Page #${page.id}` : "Contact Page");

export const getContactPageSummary = (page = {}) =>
  normalizeString(page.contact_description).trim() ||
  normalizeString(page.address).trim() ||
  "No contact copy set yet.";
