import axios from "axios";
import { Edit3, Plus, RefreshCw, Search, Tags, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button, Input, Popup, Table } from "../../components/ui/uiExports";
import { getAuthHeaders } from "../../utils/auth";

const API_ROOT = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api"
).replace(/\/$/, "");

const BLOG_CATEGORY_ENDPOINT = `${API_ROOT}/blog-categories`;

const initialForm = {
  name: "",
};

const formatDate = (value) => {
  if (!value) return "N/A";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
};

export default function BlogCategoryList() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [query, setQuery] = useState("");
  const [form, setForm] = useState(initialForm);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteCategory, setDeleteCategory] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchCategories = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.get(BLOG_CATEGORY_ENDPOINT, {
        headers: getAuthHeaders(),
      });
      setCategories(response.data?.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load blog categories."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(fetchCategories);
  }, []);

  const filteredCategories = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) return categories;

    return categories.filter((category) =>
      [category.id, category.name]
        .filter((value) => value !== null && value !== undefined)
        .some((value) => String(value).toLowerCase().includes(normalizedQuery))
    );
  }, [categories, query]);

  const tableRows = useMemo(
    () =>
      filteredCategories.map((category, index) => ({
        ...category,
        sno: index + 1,
      })),
    [filteredCategories]
  );

  const closeForm = () => {
    if (isSubmitting) return;

    setIsFormOpen(false);
    setEditingCategory(null);
    setForm(initialForm);
    setFormError("");
  };

  const openCreateForm = () => {
    setEditingCategory(null);
    setForm(initialForm);
    setFormError("");
    setIsFormOpen(true);
  };

  const openEditForm = (category) => {
    setEditingCategory(category);
    setForm({
      name: category.name || "",
    });
    setFormError("");
    setIsFormOpen(true);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
    setFormError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const name = form.name.trim();

    if (!name) {
      setFormError("Category name is required.");
      return;
    }

    const duplicateCategory = categories.find(
      (category) =>
        category.name?.trim().toLowerCase() === name.toLowerCase() &&
        category.id !== editingCategory?.id
    );

    if (duplicateCategory) {
      setFormError("A category with this name already exists.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setFormError("");

    try {
      if (editingCategory) {
        const response = await axios.put(
          `${BLOG_CATEGORY_ENDPOINT}/${editingCategory.id}`,
          { name },
          { headers: getAuthHeaders() }
        );
        const updatedCategory = response.data?.data || {
          ...editingCategory,
          name,
        };

        setCategories((currentCategories) =>
          currentCategories.map((category) =>
            category.id === editingCategory.id ? updatedCategory : category
          )
        );
      } else {
        const response = await axios.post(
          BLOG_CATEGORY_ENDPOINT,
          { name },
          { headers: getAuthHeaders() }
        );
        const createdCategory = response.data?.data;

        if (createdCategory) {
          setCategories((currentCategories) => [
            createdCategory,
            ...currentCategories,
          ]);
        } else {
          await fetchCategories();
        }
      }

      setIsFormOpen(false);
      setEditingCategory(null);
      setForm(initialForm);
    } catch (err) {
      setFormError(
        err.response?.data?.message ||
          err.message ||
          "Failed to save blog category."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteCategory) return;

    setIsDeleting(true);
    setError("");

    try {
      await axios.delete(`${BLOG_CATEGORY_ENDPOINT}/${deleteCategory.id}`, {
        headers: getAuthHeaders(),
      });
      setCategories((currentCategories) =>
        currentCategories.filter((category) => category.id !== deleteCategory.id)
      );
      setDeleteCategory(null);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to delete blog category."
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
      label: "Category",
      render: (value) => (
        <span className="font-black text-slate-950">{value || "N/A"}</span>
      ),
    },
    {
      key: "created_at",
      label: "Created",
      render: (value, row) => formatDate(value || row.createdAt),
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
          <Button
            size="sm"
            variant="secondary"
            icon={<Edit3 className="h-3.5 w-3.5" />}
            onClick={() => openEditForm(row)}
            aria-label={`Edit blog category ${row.name}`}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="danger"
            icon={<Trash2 className="h-3.5 w-3.5" />}
            onClick={() => setDeleteCategory(row)}
            aria-label={`Delete blog category ${row.name}`}
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
            CMS Blogs
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">
            Blog Categories
          </h1>
          <p className="mt-2 text-sm font-semibold text-slate-500">
            Manage category names used to organize blog posts.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant="secondary"
            icon={<RefreshCw className="h-4 w-4" />}
            onClick={fetchCategories}
            disabled={isLoading}
          >
            Refresh
          </Button>
          <Button icon={<Plus className="h-4 w-4" />} onClick={openCreateForm}>
            Add Category
          </Button>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            name="blogCategorySearch"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by category name or ID"
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
        emptyMessage="No blog categories found."
      />

      <Popup
        isOpen={isFormOpen}
        title={editingCategory ? "Edit Blog Category" : "Create Blog Category"}
        description="Add or update the blog category name."
        onClose={closeForm}
        closeOnOverlayClick={!isSubmitting}
        footer={
          <>
            <Button variant="secondary" onClick={closeForm} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" form="blog-category-form" isLoading={isSubmitting}>
              {editingCategory ? "Update" : "Create"}
            </Button>
          </>
        }
      >
        <form id="blog-category-form" onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Category Name"
            name="name"
            value={form.name}
            onChange={handleFormChange}
            placeholder="Enter category name"
            error={formError}
            required
            autoFocus
          />
        </form>
      </Popup>

      <Popup
        isOpen={Boolean(deleteCategory)}
        title="Delete Blog Category"
        description="This removes the selected blog category from the CMS."
        onClose={() => setDeleteCategory(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteCategory(null)}>
              Cancel
            </Button>
            <Button variant="danger" isLoading={isDeleting} onClick={handleDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm font-semibold leading-6 text-slate-600">
          Delete blog category{" "}
          <span className="font-black text-slate-950">
            {deleteCategory?.name || "this category"}
          </span>
          ?
        </p>
        <p className="mt-3 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-bold leading-5 text-amber-800">
          <Tags className="mt-0.5 h-4 w-4 shrink-0" />
          Categories already assigned to blog posts may be blocked by the API.
        </p>
      </Popup>
    </div>
  );
}
