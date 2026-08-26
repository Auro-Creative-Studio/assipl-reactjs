import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Edit3, Plus, RefreshCw, Search, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button, Input, Popup, Select, Table } from "../../components/ui/uiExports";
import { getAuthHeaders } from "../../utils/auth";

const API_ROOT = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api"
).replace(/\/$/, "");

const SEO_ENDPOINT = `${API_ROOT}/seo`;

const formatDate = (value) => {
  if (!value) return "N/A";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
};

export default function SeoList() {
  const [seoPages, setSeoPages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [selectedSeo, setSelectedSeo] = useState(null);

  const fetchSeoPages = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.get(SEO_ENDPOINT, {
        headers: getAuthHeaders(),
      });
      setSeoPages(response.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load SEO pages.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSeoPages();
  }, []);

  const filteredSeoPages = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return seoPages.filter((seo) => {
      const matchesQuery = [
        seo.page_type,
        seo.meta_title,
        seo.meta_description,
        seo.meta_keywords,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedQuery));

      const matchesStatus =
        status === "all" ||
        (status === "active" && seo.is_active) ||
        (status === "inactive" && !seo.is_active);

      return (!normalizedQuery || matchesQuery) && matchesStatus;
    });
  }, [seoPages, query, status]);

  const handleDelete = async () => {
    if (!selectedSeo) return;

    setIsDeleting(true);
    setError("");

    try {
      await axios.delete(`${SEO_ENDPOINT}/${selectedSeo.id}`, {
        headers: getAuthHeaders(),
      });
      setSeoPages((currentPages) =>
        currentPages.filter((seo) => seo.id !== selectedSeo.id)
      );
      setSelectedSeo(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to delete SEO page.");
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    {
      key: "page_type",
      label: "Page Type",
      render: (value, row) => (
        <div>
          <p className="font-black text-slate-950">{value}</p>
          <p className="mt-1 max-w-md truncate text-xs font-semibold text-slate-500">
            {row.meta_title}
          </p>
        </div>
      ),
    },
    {
      key: "robots_index",
      label: "Robots",
      render: (value, row) => (
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-700">
          {value}, {row.robots_follow}
        </span>
      ),
    },
    {
      key: "is_active",
      label: "Status",
      render: (value) => (
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-black ring-1 ring-inset ${
            value
              ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
              : "bg-slate-100 text-slate-600 ring-slate-200"
          }`}
        >
          {value ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "updated_at",
      label: "Updated",
      render: formatDate,
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Link to={`/admin/seo/edit/${row.id}`}>
            <Button
              size="sm"
              variant="secondary"
              icon={<Edit3 className="h-3.5 w-3.5" />}
              aria-label={`Edit SEO page ${row.page_type}`}
            >
              Edit
            </Button>
          </Link>
          <Button
            size="sm"
            variant="danger"
            icon={<Trash2 className="h-3.5 w-3.5" />}
            onClick={() => setSelectedSeo(row)}
            aria-label={`Delete SEO page ${row.page_type}`}
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
            CMS SEO
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">SEO Pages</h1>
          <p className="mt-2 text-sm font-semibold text-slate-500">
            Manage page metadata, Open Graph content, robots rules, and image alt text.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant="secondary"
            icon={<RefreshCw className="h-4 w-4" />}
            onClick={fetchSeoPages}
            disabled={isLoading}
          >
            Refresh
          </Button>
          <Link to="/admin/seo/create">
            <Button icon={<Plus className="h-4 w-4" />}>Create SEO</Button>
          </Link>
        </div>
      </section>

      <section className="grid gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-[1fr_220px]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            name="seoSearch"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by page type, title, description, or keywords"
            className="[&_input]:pl-10"
          />
        </div>
        <Select
          name="seoStatus"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          options={[
            { label: "All statuses", value: "all" },
            { label: "Active only", value: "active" },
            { label: "Inactive only", value: "inactive" },
          ]}
        />
      </section>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
          {error}
        </div>
      )}

      <Table
        columns={columns}
        data={filteredSeoPages}
        isLoading={isLoading}
        emptyMessage="No SEO pages found."
      />

      <Popup
        isOpen={Boolean(selectedSeo)}
        title="Delete SEO Page"
        description="This removes the selected SEO record from the CMS."
        onClose={() => setSelectedSeo(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setSelectedSeo(null)}>
              Cancel
            </Button>
            <Button variant="danger" isLoading={isDeleting} onClick={handleDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm font-semibold leading-6 text-slate-600">
          Delete SEO settings for{" "}
          <span className="font-black text-slate-950">{selectedSeo?.page_type}</span>?
        </p>
      </Popup>
    </div>
  );
}
