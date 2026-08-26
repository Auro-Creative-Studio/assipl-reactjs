import axios from "axios";
import { ArrowLeft, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input, Select } from "../../components/ui/uiExports";
import { getAuthHeaders } from "../../utils/auth";

const API_ROOT = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api"
).replace(/\/$/, "");

const USER_ENDPOINT = `${API_ROOT}/users`;
const ROLE_ENDPOINT = `${USER_ENDPOINT}/roles`;

export default function UserCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    password: "",
    role_id: "",
  });
  const [roles, setRoles] = useState([]);
  const [errors, setErrors] = useState({});
  const [loadError, setLoadError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      setLoadError("");

      try {
        const response = await axios.get(ROLE_ENDPOINT, { headers: getAuthHeaders() });
        setRoles(response.data?.data || []);
      } catch (err) {
        setLoadError(err.response?.data?.message || err.message || "Failed to load user roles.");
      }
    };

    fetchRoles();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!formData.first_name.trim()) nextErrors.first_name = "First name is required.";
    if (!formData.email.trim()) nextErrors.email = "Email is required.";
    if (!formData.password) nextErrors.password = "Password is required.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const payload = {
        ...formData,
        role_id: formData.role_id ? Number(formData.role_id) : null,
      };

      await axios.post(USER_ENDPOINT, payload, { headers: getAuthHeaders() });
      navigate("/admin/users");
    } catch (err) {
      setSubmitError(err.response?.data?.message || err.message || "Failed to create user.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">CMS Admin</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">Add User</h1>
          <p className="mt-2 text-sm font-semibold text-slate-500">Create a new administrator account.</p>
        </div>
        <Link to="/admin/users">
          <Button variant="secondary" icon={<ArrowLeft className="h-4 w-4" />}>Back to List</Button>
        </Link>
      </section>

      {(loadError || submitError) && <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">{loadError || submitError}</div>}

      <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <Input
          label="First Name"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          placeholder="e.g. John"
          error={errors.first_name}
          required
        />
        <Input
          label="Last Name"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          placeholder="e.g. Doe"
          error={errors.last_name}
        />
        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="admin@example.com"
          error={errors.email}
          required
        />
        <Input
          label="Phone Number"
          name="phone_number"
          type="tel"
          value={formData.phone_number}
          onChange={handleChange}
          placeholder="e.g. +91 98765 43210"
          error={errors.phone_number}
        />
        <Select
          label="Role"
          name="role_id"
          value={formData.role_id}
          onChange={handleChange}
          options={roles.map((role) => ({
            value: String(role.id),
            label: role.name,
          }))}
          placeholder="No role"
          error={errors.role_id}
        />
        <Input
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Strong password"
          error={errors.password}
          required
        />
        <div className="flex justify-end pt-4"><Button type="submit" isLoading={isSubmitting} icon={<Save className="h-4 w-4" />}>Save User</Button></div>
      </form>
    </div>
  );
}
