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

const CONTACT_ENDPOINT = `${API_ROOT}/contacts`;

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

const getFullName = (contact) =>
  [contact?.first_name, contact?.last_name].filter(Boolean).join(" ") || "N/A";

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

export default function ContactForm() {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [viewContact, setViewContact] = useState(null);
  const [deleteContact, setDeleteContact] = useState(null);

  const fetchContacts = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.get(CONTACT_ENDPOINT, {
        headers: getAuthHeaders(),
      });
      setContacts(response.data?.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load contacts."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const filteredContacts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) return contacts;

    return contacts.filter((contact) =>
      [
        contact.id,
        contact.first_name,
        contact.last_name,
        getFullName(contact),
        contact.email,
        contact.mobile_number,
        contact.subject,
        contact.message,
      ]
        .filter((value) => value !== null && value !== undefined)
        .some((value) => String(value).toLowerCase().includes(normalizedQuery))
    );
  }, [contacts, query]);

  const tableRows = useMemo(
    () =>
      filteredContacts.map((contact, index) => ({
        ...contact,
        sno: index + 1,
        full_name: getFullName(contact),
      })),
    [filteredContacts]
  );

  const handleDelete = async () => {
    if (!deleteContact) return;

    setIsDeleting(true);
    setError("");

    try {
      await axios.delete(`${CONTACT_ENDPOINT}/${deleteContact.id}`, {
        headers: getAuthHeaders(),
      });
      setContacts((currentContacts) =>
        currentContacts.filter((contact) => contact.id !== deleteContact.id)
      );
      setDeleteContact(null);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to delete contact."
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
      key: "full_name",
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
      key: "subject",
      label: "Topic",
      render: (value) => (
        <span className="block max-w-[280px] truncate font-semibold text-slate-700">
          {value || "N/A"}
        </span>
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
            onClick={() => setViewContact(row)}
            aria-label={`View contact ${row.id}`}
          >
            View
          </Button>
          <Button
            size="sm"
            variant="danger"
            icon={<Trash2 className="h-3.5 w-3.5" />}
            onClick={() => setDeleteContact(row)}
            aria-label={`Delete contact ${row.id}`}
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
            CMS Messages
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">
            Contacts
          </h1>
          <p className="mt-2 text-sm font-semibold text-slate-500">
            Review contact form submissions, subjects, messages, and timestamps.
          </p>
        </div>

        <Button
          variant="secondary"
          icon={<RefreshCw className="h-4 w-4" />}
          onClick={fetchContacts}
          disabled={isLoading}
        >
          Refresh
        </Button>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            name="contactSearch"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, email, phone, subject, message, or ID"
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
        emptyMessage="No contact records found."
      />

      <Popup
        isOpen={Boolean(viewContact)}
        title="Contact Details"
        description="Complete message submitted through the contact form."
        onClose={() => setViewContact(null)}
        size="lg"
        footer={
          <Button variant="secondary" onClick={() => setViewContact(null)}>
            Close
          </Button>
        }
      >
        <dl className="grid gap-3">
          {/* <DetailRow label="S.No" value={viewContact?.sno ? `#${viewContact.sno}` : ""} /> */}
          <DetailRow label="First Name" value={viewContact?.first_name} />
          <DetailRow label="Last Name" value={viewContact?.last_name} />
          <DetailRow label="Email" value={viewContact?.email} />
          <DetailRow label="Mobile Number" value={viewContact?.mobile_number} />
          <DetailRow label="Topic" value={viewContact?.subject} />
          <DetailRow label="Message" value={viewContact?.message} />
          <DetailRow 
            label="Terms Accepted" 
            value={viewContact?.terms_accepted ? "Yes" : "No"}
          />
          <DetailRow label="Submitted Date" value={formatDateTime(viewContact?.created_at)} />
          {/* <DetailRow label="Updated" value={formatDateTime(viewContact?.updated_at)} /> */}
        </dl>
      </Popup>

      <Popup
        isOpen={Boolean(deleteContact)}
        title="Delete Contact"
        description="This removes the selected contact record from the CMS."
        onClose={() => setDeleteContact(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteContact(null)}>
              Cancel
            </Button>
            <Button variant="danger" isLoading={isDeleting} onClick={handleDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm font-semibold leading-6 text-slate-600">
          Delete contact message from{" "}
          <span className="font-black text-slate-950">
            {deleteContact?.full_name || "this user"}
          </span>
          ?
        </p>
      </Popup>
    </div>
  );
}
