import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Edit3, Plus, RefreshCw, Search, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button, Input, Popup, Table } from "../../components/ui/uiExports";
import { getAuthHeaders } from "../../utils/auth";

const API_ROOT = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api"
).replace(/\/$/, "");

const USER_ENDPOINT = `${API_ROOT}/users`;
const ROLE_ENDPOINT = `${USER_ENDPOINT}/roles`;

const formatDate = (value) => {
  if (!value) return "N/A";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
};

const getUserRoleName = (user, rolesById = {}) => {
  return (
    user.role?.name ||
    user.UserRole?.name ||
    user.user_role?.name ||
    rolesById[user.role_id] ||
    "No role"
  );
};

const getUserDisplayName = (user) => {
  return (
    [user.first_name, user.last_name].filter(Boolean).join(" ") ||
    user.name ||
    "N/A"
  );
};

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError("");

    try {
      const [usersResponse, rolesResponse] = await Promise.all([
        axios.get(USER_ENDPOINT, {
          headers: getAuthHeaders(),
        }),
        axios.get(ROLE_ENDPOINT, {
          headers: getAuthHeaders(),
        }),
      ]);
      setUsers(usersResponse.data?.data || []);
      setRoles(rolesResponse.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load users.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const rolesById = useMemo(() => {
    return roles.reduce((nextRolesById, role) => {
      nextRolesById[role.id] = role.name;
      return nextRolesById;
    }, {});
  }, [roles]);

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return users.filter((user) => {
      const matchesQuery = [
        getUserDisplayName(user),
        user.first_name,
        user.last_name,
        user.email,
        user.phone_number,
        getUserRoleName(user, rolesById),
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedQuery));

      return !normalizedQuery || matchesQuery;
    });
  }, [users, query, rolesById]);

  const handleDelete = async () => {
    if (!selectedUser) return;

    setIsDeleting(true);
    setError("");

    try {
      await axios.delete(`${USER_ENDPOINT}/${selectedUser.id}`, {
        headers: getAuthHeaders(),
      });
      setUsers((currentUsers) =>
        currentUsers.filter((user) => user.id !== selectedUser.id)
      );
      setSelectedUser(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to delete user.");
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    {
      key: "first_name",
      label: "Name",
      render: (_, row) => <span className="font-black text-slate-950">{getUserDisplayName(row)}</span>,
    },
    {
      key: "email",
      label: "Email",
      render: (value) => <span className="font-semibold text-slate-600">{value}</span>,
    },
    {
      key: "phone_number",
      label: "Phone",
      render: (value) => <span className="font-semibold text-slate-600">{value || "N/A"}</span>,
    },
    {
      key: "role_id",
      label: "Role",
      render: (_, row) => (
        <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-600">
          {getUserRoleName(row, rolesById)}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      render: formatDate,
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Link to={`/admin/users/edit/${row.id}`}>
            <Button size="sm" variant="secondary" icon={<Edit3 className="h-3.5 w-3.5" />}>
              Edit
            </Button>
          </Link>
          <Button
            size="sm"
            variant="danger"
            icon={<Trash2 className="h-3.5 w-3.5" />}
            onClick={() => setSelectedUser(row)}
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
          <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">CMS Admin</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">Users</h1>
          <p className="mt-2 text-sm font-semibold text-slate-500">Manage CMS access and administrators.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="secondary" icon={<RefreshCw className="h-4 w-4" />} onClick={fetchUsers} disabled={isLoading}>
            Refresh
          </Button>
          <Link to="/admin/users/create">
            <Button icon={<Plus className="h-4 w-4" />}>Add User</Button>
          </Link>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name, email, phone, or role" className="[&_input]:pl-10" />
        </div>
      </section>

      {error && <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">{error}</div>}
      <Table columns={columns} data={filteredUsers} isLoading={isLoading} emptyMessage="No users found." />

      <Popup isOpen={Boolean(selectedUser)} title="Delete User" description="This removes the selected user record from the CMS." onClose={() => setSelectedUser(null)} footer={<><Button variant="secondary" onClick={() => setSelectedUser(null)}>Cancel</Button><Button variant="danger" isLoading={isDeleting} onClick={handleDelete}>Delete</Button></>}>
        <p className="text-sm font-semibold leading-6 text-slate-600">Delete user <span className="font-black text-slate-950">{selectedUser ? getUserDisplayName(selectedUser) : ""}</span>?</p>
      </Popup>
    </div>
  );
}
