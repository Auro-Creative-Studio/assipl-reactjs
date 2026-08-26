import axios from "axios";
import { RefreshCw, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button, Input, Popup, Table } from "../components/ui/uiExports";
import { getAuthHeaders } from "../utils/auth";

const API_ROOT = (
  import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/$/, "");
const ENDPOINT = `${API_ROOT}/newsletter-subscribers`;

const formatDate = (value) => value
  ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value))
  : "N/A";

export default function NewsletterSubscribers() {
  const [subscribers, setSubscribers] = useState([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSubscriber, setDeleteSubscriber] = useState(null);

  const fetchSubscribers = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await axios.get(ENDPOINT, { headers: getAuthHeaders() });
      setSubscribers(response.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load subscribers.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(fetchSubscribers);
  }, []);

  const rows = useMemo(() => {
    const search = query.trim().toLowerCase();
    return subscribers
      .filter((item) => !search || item.email.toLowerCase().includes(search) || String(item.id).includes(search))
      .map((item, index) => ({ ...item, sno: index + 1 }));
  }, [query, subscribers]);

  const handleDelete = async () => {
    if (!deleteSubscriber) return;
    setIsDeleting(true);
    try {
      await axios.delete(`${ENDPOINT}/${deleteSubscriber.id}`, { headers: getAuthHeaders() });
      setSubscribers((current) => current.filter((item) => item.id !== deleteSubscriber.id));
      setDeleteSubscriber(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to delete subscriber.");
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    { key: "sno", label: "S.No", render: (value) => <span className="font-black text-slate-950">{value}</span> },
    { key: "email", label: "Email", render: (value) => <a href={`mailto:${value}`} className="font-bold text-slate-700 hover:text-primary">{value}</a> },
    { key: "created_at", label: "Subscribed At", render: (value, row) => formatDate(value || row.createdAt) },
    {
      key: "actions", label: "Actions", render: (_, row) => (
        <Button size="sm" variant="danger" icon={<Trash2 className="h-3.5 w-3.5" />} onClick={() => setDeleteSubscriber(row)}>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">CMS Audience</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">Newsletter Subscribers</h1>
          <p className="mt-2 text-sm font-semibold text-slate-500">View email addresses submitted through the website footer.</p>
        </div>
        <Button variant="secondary" icon={<RefreshCw className="h-4 w-4" />} onClick={fetchSubscribers} disabled={isLoading}>Refresh</Button>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input name="subscriberSearch" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by email or ID" className="[&_input]:pl-10" />
        </div>
      </section>

      {error && <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">{error}</div>}
      <Table columns={columns} data={rows} isLoading={isLoading} emptyMessage="No newsletter subscribers yet." />

      <Popup
        isOpen={Boolean(deleteSubscriber)}
        title="Delete Subscriber"
        description="This email will be removed from the newsletter subscriber list."
        onClose={() => setDeleteSubscriber(null)}
        footer={<><Button variant="secondary" onClick={() => setDeleteSubscriber(null)}>Cancel</Button><Button variant="danger" isLoading={isDeleting} onClick={handleDelete}>Delete</Button></>}
      >
        <p className="text-sm font-semibold text-slate-600">Delete <span className="font-black text-slate-950">{deleteSubscriber?.email}</span>?</p>
      </Popup>
    </div>
  );
}
