import axios from "axios";
import { Eye, RefreshCw, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button, Input, Popup, Select, Table } from "../../components/ui/uiExports";
import { getAuthHeaders } from "../../utils/auth";

const API_ROOT = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api"
).replace(/\/$/, "");

const COOKIE_CONSENT_ENDPOINT = `${API_ROOT}/cookie-consents`;

const normalizeConsentData = (payload) => {
  const data = payload?.data;

  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") return [data];
  if (Array.isArray(payload)) return payload;

  return [];
};

const formatDateTime = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "N/A";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const isLocalIp = (value) =>
  ["::1", "127.0.0.1", "localhost"].includes(String(value || "").trim());

const getDisplayIp = (consent) => {
  const candidates = [
    consent?.public_ip,
    consent?.client_ip,
    consent?.ip,
    consent?.ipAddress,
    consent?.ip_address,
  ].filter(Boolean);

  return candidates.find((value) => !isLocalIp(value)) || candidates[0] || "";
};

const DetailRow = ({ label, value }) => (
  <div className="grid gap-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 sm:grid-cols-[150px_1fr] sm:gap-4">
    <dt className="text-xs font-black uppercase tracking-widest text-slate-400">
      {label}
    </dt>
    <dd className="break-words text-sm font-bold text-slate-800">
      {value || "N/A"}
    </dd>
  </div>
);

export default function CookieConsentList() {
  const [consents, setConsents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [consentType, setConsentType] = useState("all");
  const [viewConsent, setViewConsent] = useState(null);
  const [deleteConsent, setDeleteConsent] = useState(null);

  const fetchConsents = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.get(COOKIE_CONSENT_ENDPOINT, {
        headers: getAuthHeaders(),
      });
      setConsents(normalizeConsentData(response.data));
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load cookie consents."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConsents();
  }, []);

  const consentTypeOptions = useMemo(() => {
    const types = Array.from(
      new Set(consents.map((consent) => consent.consent_type).filter(Boolean))
    );

    return [
      { label: "All consent types", value: "all" },
      ...types.map((type) => ({ label: type, value: type })),
    ];
  }, [consents]);

  const filteredConsents = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return consents.filter((consent) => {
      const matchesQuery = [
        consent.id,
        getDisplayIp(consent),
        consent.ip_address,
        consent.ip,
        consent.consent_type,
        consent.device,
        consent.session_id,
        consent.country,
        consent.city,
        consent.language,
        consent.timezone,
      ]
        .filter((value) => value !== null && value !== undefined)
        .some((value) => String(value).toLowerCase().includes(normalizedQuery));

      const matchesType =
        consentType === "all" || consent.consent_type === consentType;

      return (!normalizedQuery || matchesQuery) && matchesType;
    });
  }, [consents, query, consentType]);

  const handleDelete = async () => {
    if (!deleteConsent) return;

    setIsDeleting(true);
    setError("");

    try {
      await axios.delete(`${COOKIE_CONSENT_ENDPOINT}/${deleteConsent.id}`, {
        headers: getAuthHeaders(),
      });
      setConsents((currentConsents) =>
        currentConsents.filter((consent) => consent.id !== deleteConsent.id)
      );
      setDeleteConsent(null);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to delete cookie consent."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    {
      key: "consent_type",
      label: "Consent Type",
      render: (value) => (
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-700">
          {value || "N/A"}
        </span>
      ),
    },
    {
      key: "ip_address",
      label: "IP Address",
      render: (_, row) => (
        <span className="font-bold text-slate-800">
          {getDisplayIp(row) || "N/A"}
        </span>
      ),
    },
    {
      key: "location",
      label: "Location",
      render: (_, row) => (
        <span className="block max-w-[220px] truncate font-semibold text-slate-600">
          {[row.city, row.country].filter(Boolean).join(", ") || "N/A"}
        </span>
      ),
    },
    {
      key: "device",
      label: "Device",
      render: (value) => (
        <span className="block max-w-[260px] truncate font-semibold text-slate-600">
          {value || "N/A"}
        </span>
      ),
    },
    {
      key: "consent_timestamp",
      label: "Consent Time",
      render: (value, row) => formatDateTime(value || row.created_at),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            icon={<Eye className="h-3.5 w-3.5" />}
            onClick={() => setViewConsent(row)}
            aria-label={`View cookie consent ${row.id}`}
          >
            View
          </Button>
          <Button
            size="sm"
            variant="danger"
            icon={<Trash2 className="h-3.5 w-3.5" />}
            onClick={() => setDeleteConsent(row)}
            aria-label={`Delete cookie consent ${row.id}`}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
            CMS Tracking
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">
            Cookie Consents
          </h1>
          <p className="mt-2 text-sm font-semibold text-slate-500">
            Review visitor consent records, device details, IP addresses, and timestamps.
          </p>
        </div>

        <Button
          variant="secondary"
          icon={<RefreshCw className="h-4 w-4" />}
          onClick={fetchConsents}
          disabled={isLoading}
        >
          Refresh
        </Button>
      </section>

      <section className="grid gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-[1fr_240px]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            name="cookieConsentSearch"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by ID, IP, consent type, device, location, language, or timezone"
            className="[&_input]:pl-10"
          />
        </div>

        <Select
          name="consentType"
          value={consentType}
          onChange={(event) => setConsentType(event.target.value)}
          options={consentTypeOptions}
        />
      </section>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
          {error}
        </div>
      )}

      <Table
        columns={columns}
        data={filteredConsents}
        isLoading={isLoading}
        emptyMessage="No cookie consent records found."
      />

      <Popup
        isOpen={Boolean(viewConsent)}
        title="Cookie Consent Details"
        description="Complete data stored for this consent record."
        onClose={() => setViewConsent(null)}
        size="lg"
        footer={
          <Button variant="secondary" onClick={() => setViewConsent(null)}>
            Close
          </Button>
        }
      >
        <dl className="grid gap-3">
          {/* <DetailRow label="ID" value={viewConsent?.id ? `#${viewConsent.id}` : ""} /> */}
          <DetailRow label="Session ID" value={viewConsent?.session_id} />
          <DetailRow label="IP Address" value={getDisplayIp(viewConsent)} />
          <DetailRow label="Country" value={viewConsent?.country} />
          <DetailRow label="City" value={viewConsent?.city} />
          <DetailRow label="Consent Type" value={viewConsent?.consent_type} />
          <DetailRow label="Device" value={viewConsent?.device} />
          <DetailRow label="Language" value={viewConsent?.language} />
          <DetailRow label="Timezone" value={viewConsent?.timezone} />
          <DetailRow label="Latitude" value={viewConsent?.latitude} />
          <DetailRow label="Longitude" value={viewConsent?.longitude} />
          <DetailRow
            label="Consent Time"
            value={formatDateTime(viewConsent?.consent_timestamp || viewConsent?.created_at)}
          />
          {/* <DetailRow label="Created At" value={formatDateTime(viewConsent?.created_at)} />
          <DetailRow label="Updated At" value={formatDateTime(viewConsent?.updated_at)} /> */}
        </dl>
      </Popup>

      <Popup
        isOpen={Boolean(deleteConsent)}
        title="Delete Cookie Consent"
        description="This removes the selected consent record from the CMS."
        onClose={() => setDeleteConsent(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteConsent(null)}>
              Cancel
            </Button>
            <Button variant="danger" isLoading={isDeleting} onClick={handleDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm font-semibold leading-6 text-slate-600">
          Delete this cookie consent record ?
        </p>
      </Popup>
    </div>
  );
}
