import axios from "axios";
import { Eye, RefreshCw, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button, Input, Popup, Table } from "../components/ui/uiExports";
import { getAuthHeaders } from "../utils/auth";

const API_ROOT = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api"
).replace(/\/$/, "");

const ENQUIRY_ENDPOINT = `${API_ROOT}/enquiries`;

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

const formatBudget = (value) => {
  if (!value) return "N/A";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value));
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

export default function EnquiryForm() {
  const [enquiries, setEnquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [viewEnquiry, setViewEnquiry] = useState(null);
  const [deleteEnquiry, setDeleteEnquiry] = useState(null);

  const fetchEnquiries = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.get(ENQUIRY_ENDPOINT, {
        headers: getAuthHeaders(),
      });
      setEnquiries(response.data?.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load enquiries."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const filteredEnquiries = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) return enquiries;

    return enquiries.filter((enquiry) =>
      [
        enquiry.id,
        enquiry.name,
        enquiry.email,
        enquiry.mobile_number,
        enquiry.service_needed,
      ]
        .filter((value) => value !== null && value !== undefined)
        .some((value) => String(value).toLowerCase().includes(normalizedQuery))
    );
  }, [enquiries, query]);

  const tableRows = useMemo(
    () =>
      filteredEnquiries.map((enquiry, index) => ({
        ...enquiry,
        sno: index + 1,
      })),
    [filteredEnquiries]
  );

  const handleDelete = async () => {
    if (!deleteEnquiry) return;

    setIsDeleting(true);
    setError("");

    try {
      await axios.delete(`${ENQUIRY_ENDPOINT}/${deleteEnquiry.id}`, {
        headers: getAuthHeaders(),
      });
      setEnquiries((currentEnquiries) =>
        currentEnquiries.filter((enquiry) => enquiry.id !== deleteEnquiry.id)
      );
      setDeleteEnquiry(null);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to delete enquiry."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    {
      key: "sno",
      label: "S.No",
      render: (value) => (
        <span className="font-black text-slate-950">{value}</span>
      ),
    },
    {
      key: "name",
      label: "Name",
      render: (value) => (
        <span className="font-black text-slate-950">{value || "N/A"}</span>
      ),
    },
    {
      key: "email",
      label: "Email",
      render: (value) => (
        <span className="font-semibold text-slate-600">{value || "N/A"}</span>
      ),
    },
    {
      key: "mobile_number",
      label: "Phone Number",
      render: (value) => (
        <span className="font-semibold text-slate-700">{value || "N/A"}</span>
      ),
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
            onClick={() => setViewEnquiry(row)}
            aria-label={`View enquiry ${row.id}`}
          >
            View
          </Button>
          <Button
            size="sm"
            variant="danger"
            icon={<Trash2 className="h-3.5 w-3.5" />}
            onClick={() => setDeleteEnquiry(row)}
            aria-label={`Delete enquiry ${row.id}`}
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
            CMS Leads
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">
            Enquiries
          </h1>
          <p className="mt-2 text-sm font-semibold text-slate-500">
            View form enquiries with contact details, service needs, budget, and company brief.
          </p>
        </div>

        <Button
          variant="secondary"
          icon={<RefreshCw className="h-4 w-4" />}
          onClick={fetchEnquiries}
          disabled={isLoading}
        >
          Refresh
        </Button>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            name="enquirySearch"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, email, phone, service, or ID"
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
        data={tableRows}
        isLoading={isLoading}
        emptyMessage="No enquiry records found."
      />

      <Popup
        isOpen={Boolean(viewEnquiry)}
        title="Enquiry Details"
        description="Complete details submitted through the enquiry form."
        onClose={() => setViewEnquiry(null)}
        size="lg"
        footer={
          <Button variant="secondary" onClick={() => setViewEnquiry(null)}>
            Close
          </Button>
        }
      >
        <dl className="grid gap-3">
          {/* <DetailRow label="S.No" value={viewEnquiry?.sno ? `#${viewEnquiry.sno}` : ""} /> */}
          <DetailRow label="Name" value={viewEnquiry?.name} />
          <DetailRow label="Email" value={viewEnquiry?.email} />
          <DetailRow label="Phone" value={viewEnquiry?.mobile_number} />
          <DetailRow label="Service" value={viewEnquiry?.service_needed} />
          <DetailRow label="Budget" value={formatBudget(viewEnquiry?.budget_rs)} />
          <DetailRow label="Brief" value={viewEnquiry?.company_brief} />
          <DetailRow label="Submitted Date" value={formatDateTime(viewEnquiry?.created_at)} />
          {/* <DetailRow label="Updated" value={formatDateTime(viewEnquiry?.updated_at)} /> */}
        </dl>
      </Popup>

      <Popup
        isOpen={Boolean(deleteEnquiry)}
        title="Delete Enquiry"
        description="This removes the selected enquiry record from the CMS."
        onClose={() => setDeleteEnquiry(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteEnquiry(null)}>
              Cancel
            </Button>
            <Button variant="danger" isLoading={isDeleting} onClick={handleDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm font-semibold leading-6 text-slate-600">
          Delete enquiry from{" "}
          <span className="font-black text-slate-950">
            {deleteEnquiry?.name || "this user"}
          </span>
          ?
        </p>
      </Popup>
    </div>
  );
}
