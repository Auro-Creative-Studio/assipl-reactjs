import axios from "axios";
import { ArrowLeft, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input } from "../../components/ui/uiExports";
import { getAuthHeaders } from "../../utils/auth";

const API_ROOT = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api"
).replace(/\/$/, "");

const POSITION_ENDPOINT = `${API_ROOT}/career-positions`;

const initialForm = {
  position_name: "",
  sort_order: 0,
  status: true,
};

const normalizeForm = (position = {}) => ({
  position_name: position.position_name || "",
  sort_order: position.sort_order ?? 0,
  status: position.status === undefined ? true : Boolean(position.status),
});

const buildPayload = (formData) => ({
  position_name: formData.position_name.trim(),
  sort_order: Number(formData.sort_order) || 0,
  status: formData.status,
});

export default function CareerPositionForm({ positionId = null, mode = "create" }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loadError, setLoadError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isLoading, setIsLoading] = useState(Boolean(positionId));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEdit = mode === "edit";

  useEffect(() => {
    const fetchFormData = async () => {
      setIsLoading(Boolean(positionId));
      setLoadError("");

      try {
        if (positionId) {
          const response = await axios.get(`${POSITION_ENDPOINT}/${positionId}`, {
            headers: getAuthHeaders(),
          });
          setFormData(normalizeForm(response.data?.data || {}));
        }
      } catch (err) {
        setLoadError(
          err.response?.data?.message || err.message || "Failed to load career position."
        );
      } finally {
        setIsLoading(false);
      }
    };

    void Promise.resolve().then(fetchFormData);
  }, [positionId]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!formData.position_name.trim()) {
      nextErrors.position_name = "Position name is required.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const payload = buildPayload(formData);

      if (isEdit) {
        await axios.put(`${POSITION_ENDPOINT}/${positionId}`, payload, {
          headers: getAuthHeaders(),
        });
      } else {
        await axios.post(POSITION_ENDPOINT, payload, {
          headers: getAuthHeaders(),
        });
      }

      navigate("/admin/career-positions");
    } catch (err) {
      setSubmitError(
        err.response?.data?.message || err.message || "Failed to save career position."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
            CMS Careers
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">
            {isEdit ? "Edit Position" : "Create Position"}
          </h1>
          <p className="mt-2 text-sm font-semibold text-slate-500">
            Positions listed here populate the dropdown on the public job application form.
          </p>
        </div>

        <Link to="/admin/career-positions">
          <Button variant="secondary" icon={<ArrowLeft className="h-4 w-4" />}>
            Back to List
          </Button>
        </Link>
      </section>

      {(loadError || submitError) && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
          {loadError || submitError}
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white py-16 text-slate-500 shadow-sm">
          <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-slate-200 border-t-slate-950" />
          <p className="text-sm font-semibold">Loading position data...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="grid gap-6 xl:grid-cols-[1fr_340px]">
            <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <Input
                label="Position Name"
                name="position_name"
                value={formData.position_name}
                onChange={handleChange}
                placeholder="e.g. Senior Backend Developer"
                error={errors.position_name}
                required
              />

              <Input
                label="Sort Order"
                name="sort_order"
                type="number"
                value={formData.sort_order}
                onChange={handleChange}
                placeholder="0"
              />
            </div>

            <aside className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm xl:sticky xl:top-24 xl:self-start">
              <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <span>
                  <span className="block text-sm font-black text-slate-950">Active</span>
                  <span className="mt-1 block text-xs font-semibold text-slate-500">
                    Visible in the public application form dropdown.
                  </span>
                </span>
                <input
                  type="checkbox"
                  name="status"
                  checked={formData.status}
                  onChange={handleChange}
                  className="h-5 w-5 rounded border-slate-300 accent-slate-950"
                />
              </label>

              <Button
                type="submit"
                fullWidth
                isLoading={isSubmitting}
                icon={<Save className="h-4 w-4" />}
              >
                {isEdit ? "Update Position" : "Save Position"}
              </Button>
            </aside>
          </section>
        </form>
      )}
    </div>
  );
}
