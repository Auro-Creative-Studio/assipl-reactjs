import axios from "axios";
import { Edit3, Plus, RefreshCw, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Input, Popup, Select, Table } from "../../components/ui/uiExports";
import { getAuthHeaders } from "../../utils/auth";

const API_ROOT = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api"
).replace(/\/$/, "");

const POSITION_ENDPOINT = `${API_ROOT}/career-positions`;

const formatDate = (value) => {
  if (!value) return "N/A";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
};

export default function CareerPositionList() {
  const [positions, setPositions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [deletePosition, setDeletePosition] = useState(null);

  const fetchPositions = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.get(POSITION_ENDPOINT, {
        headers: getAuthHeaders(),
      });

      const items = (response.data?.data || []).slice().sort(
        (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
      );
      setPositions(items);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load career positions.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(fetchPositions);
  }, []);

  const filteredPositions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return positions.filter((position) => {
      const matchesQuery =
        !normalizedQuery ||
        [position.id, position.position_name]
          .filter((value) => value !== null && value !== undefined)
          .some((value) => String(value).toLowerCase().includes(normalizedQuery));

      const matchesStatus =
        status === "all" ||
        (status === "active" && position.status) ||
        (status === "inactive" && !position.status);

      return matchesQuery && matchesStatus;
    });
  }, [positions, query, status]);

  const handleDelete = async () => {
    if (!deletePosition) return;

    setIsDeleting(true);
    setError("");

    try {
      await axios.delete(`${POSITION_ENDPOINT}/${deletePosition.id}`, {
        headers: getAuthHeaders(),
      });
      setPositions((current) => current.filter((position) => position.id !== deletePosition.id));
      setDeletePosition(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to delete career position.");
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    {
      key: "sort_order",
      label: "Order",
      render: (value) => <span className="font-semibold text-slate-600">{value ?? 0}</span>,
    },
    {
      key: "position_name",
      label: "Position",
      render: (value) => <p className="font-black text-slate-950">{value || "N/A"}</p>,
    },
    {
      key: "status",
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
      render: (value, row) => formatDate(value || row.updatedAt),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Link to={`/admin/career-positions/edit/${row.id}`}>
            <Button
              size="sm"
              variant="secondary"
              icon={<Edit3 className="h-3.5 w-3.5" />}
              aria-label={`Edit position ${row.position_name}`}
            >
              Edit
            </Button>
          </Link>
          <Button
            size="sm"
            variant="danger"
            icon={<Trash2 className="h-3.5 w-3.5" />}
            onClick={() => setDeletePosition(row)}
            aria-label={`Delete position ${row.position_name}`}
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
          <h1 className="mt-2 text-3xl font-black text-slate-950">Career Positions</h1>
          <p className="mt-2 text-sm font-semibold text-slate-500">
            Manage the open positions applicants can pick from on the job application form.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant="secondary"
            icon={<RefreshCw className="h-4 w-4" />}
            onClick={fetchPositions}
            disabled={isLoading}
          >
            Refresh
          </Button>
          <Link to="/admin/career-positions/create">
            <Button icon={<Plus className="h-4 w-4" />}>Add Position</Button>
          </Link>
        </div>
      </section>

      <section className="grid gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-[1fr_220px]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            name="positionSearch"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by position name"
            className="[&_input]:pl-10"
          />
        </div>
        <Select
          name="positionStatus"
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
        data={filteredPositions}
        isLoading={isLoading}
        emptyMessage="No career positions found."
      />

      <Popup
        isOpen={Boolean(deletePosition)}
        title="Delete Position"
        description="This removes the position from the public application form dropdown."
        onClose={() => setDeletePosition(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeletePosition(null)}>
              Cancel
            </Button>
            <Button variant="danger" isLoading={isDeleting} onClick={handleDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm font-semibold leading-6 text-slate-600">
          Delete{" "}
          <span className="font-black text-slate-950">
            {deletePosition?.position_name || "this position"}
          </span>
          ?
        </p>
      </Popup>
    </div>
  );
}
