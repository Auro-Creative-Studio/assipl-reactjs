import axios from "axios";
import { Download, Eye, RefreshCw, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button, Input, Popup, Table } from "../../components/ui/uiExports";
import { getAuthHeaders } from "../../utils/auth";

const API_ROOT = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api"
).replace(/\/$/, "");

const APPLICATION_ENDPOINT = `${API_ROOT}/career-forms`;
const BACKEND_ORIGIN = (import.meta.env.VITE_MEDIA_BASE_URL || API_ROOT.replace(/\/api$/, "")).replace(/\/$/, "");

const getMediaUrl = (path) => {
  if (!path) return "";

  const textPath = String(path);

  if (textPath.startsWith("http")) return textPath;

  return `${BACKEND_ORIGIN}/${textPath.replace(/^\//, "")}`;
};

const formatDateTime = (value) => {
  if (!value) return "N/A";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

const DetailRow = ({ label, value }) => (
  <div className="grid gap-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 sm:grid-cols-[150px_1fr] sm:gap-4">
    <dt className="text-xs font-black uppercase tracking-widest text-slate-400">{label}</dt>
    <dd className="break-words text-sm font-bold text-slate-800">{value || "N/A"}</dd>
  </div>
);

export default function CareerApplicationList() {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [viewApplication, setViewApplication] = useState(null);
  const [deleteApplication, setDeleteApplication] = useState(null);

  const fetchApplications = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.get(APPLICATION_ENDPOINT, {
        headers: getAuthHeaders(),
      });
      setApplications(response.data?.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to load career applications."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(fetchApplications);
  }, []);

  const filteredApplications = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) return applications;

    return applications.filter((application) =>
      [
        application.id,
        application.full_name,
        application.email,
        application.phone_number,
        application.position?.position_name,
      ]
        .filter((value) => value !== null && value !== undefined)
        .some((value) => String(value).toLowerCase().includes(normalizedQuery))
    );
  }, [applications, query]);

  const handleDelete = async () => {
    if (!deleteApplication) return;

    setIsDeleting(true);
    setError("");

    try {
      await axios.delete(`${APPLICATION_ENDPOINT}/${deleteApplication.id}`, {
        headers: getAuthHeaders(),
      });
      setApplications((current) =>
        current.filter((application) => application.id !== deleteApplication.id)
      );
      setDeleteApplication(null);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to delete career application."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    {
      key: "full_name",
      label: "Applicant",
      render: (value) => <span className="font-black text-slate-950">{value || "N/A"}</span>,
    },
    {
      key: "email",
      label: "Email",
      render: (value) => <span className="font-semibold text-slate-600">{value || "N/A"}</span>,
    },
    {
      key: "phone_number",
      label: "Phone",
      render: (value) => <span className="font-semibold text-slate-700">{value || "N/A"}</span>,
    },
    {
      key: "position",
      label: "Position",
      render: (value) => (
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-700 ring-1 ring-inset ring-slate-200">
          {value?.position_name || "N/A"}
        </span>
      ),
    },
    {
      key: "created_at",
      label: "Applied",
      render: (value) => formatDateTime(value),
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
            onClick={() => setViewApplication(row)}
            aria-label={`View application from ${row.full_name}`}
          >
            View
          </Button>
          <Button
            size="sm"
            variant="danger"
            icon={<Trash2 className="h-3.5 w-3.5" />}
            onClick={() => setDeleteApplication(row)}
            aria-label={`Delete application from ${row.full_name}`}
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
            CMS Careers
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">Job Applications</h1>
          <p className="mt-2 text-sm font-semibold text-slate-500">
            View applications submitted through the public job application form.
          </p>
        </div>

        <Button
          variant="secondary"
          icon={<RefreshCw className="h-4 w-4" />}
          onClick={fetchApplications}
          disabled={isLoading}
        >
          Refresh
        </Button>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            name="applicationSearch"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, email, phone, or position"
            className="[&_input]:pl-10"
          />
        </div>
      </section>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
          {error}
        </div>
      )}

      <Table
        columns={columns}
        data={filteredApplications}
        isLoading={isLoading}
        emptyMessage="No job applications found."
      />

      <Popup
        isOpen={Boolean(viewApplication)}
        title="Application Details"
        description="Complete details submitted through the job application form."
        onClose={() => setViewApplication(null)}
        size="lg"
        footer={
          <>
            {viewApplication?.upload_resume && (
              <a
                href={getMediaUrl(viewApplication.upload_resume)}
                target="_blank"
                rel="noreferrer"
              >
                <Button variant="secondary" icon={<Download className="h-4 w-4" />}>
                  Download Resume
                </Button>
              </a>
            )}
            <Button variant="secondary" onClick={() => setViewApplication(null)}>
              Close
            </Button>
          </>
        }
      >
        <dl className="grid gap-3">
          <DetailRow label="Full Name" value={viewApplication?.full_name} />
          <DetailRow label="Email" value={viewApplication?.email} />
          <DetailRow label="Phone" value={viewApplication?.phone_number} />
          <DetailRow label="Position" value={viewApplication?.position?.position_name} />
          <DetailRow label="Message" value={viewApplication?.message} />
          <DetailRow label="Applied On" value={formatDateTime(viewApplication?.created_at)} />
        </dl>
      </Popup>

      <Popup
        isOpen={Boolean(deleteApplication)}
        title="Delete Application"
        description="This removes the selected job application from the CMS."
        onClose={() => setDeleteApplication(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteApplication(null)}>
              Cancel
            </Button>
            <Button variant="danger" isLoading={isDeleting} onClick={handleDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm font-semibold leading-6 text-slate-600">
          Delete application from{" "}
          <span className="font-black text-slate-950">
            {deleteApplication?.full_name || "this applicant"}
          </span>
          ?
        </p>
      </Popup>
    </div>
  );
}
