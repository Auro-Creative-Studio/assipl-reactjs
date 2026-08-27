import axios from "axios";
import { Edit3, GripVertical, Plus, RefreshCw, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Input, Popup, Select, Table } from "../../components/ui/uiExports";
import { getAuthHeaders } from "../../utils/auth";

const API_ROOT = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api"
).replace(/\/$/, "");

const PRODUCT_ENDPOINT = `${API_ROOT}/products`;

const getMediaUrl = (path) => {
  if (!path) return null;

  const textPath = String(path);
  const backendUrl = API_ROOT.replace(/\/api$/, "");

  if (textPath.startsWith("http")) {
    try {
      const uploadPath = new URL(textPath).pathname;

      if (uploadPath.includes("/uploads/")) {
        return `${backendUrl}${uploadPath}`;
      }
    } catch {
      return textPath;
    }

    return textPath;
  }

  return `${backendUrl}/${textPath.replace(/^\//, "")}`;
};

const formatDate = (value) => {
  if (!value) return "N/A";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
};

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [deleteProduct, setDeleteProduct] = useState(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError("");

    try {
      const productsResponse = await axios.get(PRODUCT_ENDPOINT, {
        headers: getAuthHeaders(),
      });

      const items = (productsResponse.data?.data || [])
        .slice()
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

      setProducts(items);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load products.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(fetchProducts);
  }, []);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return products.filter((product) => {
      const matchesQuery =
        !normalizedQuery ||
        [
          product.id,
          product.title,
          product.slug,
          product.meta_title,
          product.meta_description,
          product.meta_keywords,
        ]
          .filter((value) => value !== null && value !== undefined)
          .some((value) => String(value).toLowerCase().includes(normalizedQuery));

      const matchesStatus =
        status === "all" ||
        (status === "published" && product.published) ||
        (status === "draft" && !product.published);

      return matchesQuery && matchesStatus;
    });
  }, [products, query, status]);

  const tableRows = useMemo(
    () => filteredProducts.map((product) => ({
      ...product,
      columnWidths: {
        title: "35%"
      }
    })),
    [filteredProducts]
  );

  const handleDelete = async () => {
    if (!deleteProduct) return;

    setIsDeleting(true);
    setError("");

    try {
      await axios.delete(`${PRODUCT_ENDPOINT}/${deleteProduct.id}`, {
        headers: getAuthHeaders(),
      });
      setProducts((currentProducts) =>
        currentProducts.filter((product) => product.id !== deleteProduct.id)
      );
      setDeleteProduct(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to delete product.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReorder = async (fromIdx, toIdx) => {
    const draggedItem = filteredProducts[fromIdx];
    const targetItem = filteredProducts[toIdx];
    if (!draggedItem || !targetItem || draggedItem.id === targetItem.id) return;

    const fromFullIdx = products.findIndex((product) => product.id === draggedItem.id);
    const toFullIdx = products.findIndex((product) => product.id === targetItem.id);
    if (fromFullIdx === -1 || toFullIdx === -1) return;

    const reordered = products.slice();
    const [moved] = reordered.splice(fromFullIdx, 1);
    reordered.splice(toFullIdx, 0, moved);
    const withOrder = reordered.map((product, index) => ({ ...product, sort_order: index }));

    setProducts(withOrder);

    try {
      await axios.put(
        `${PRODUCT_ENDPOINT}/reorder`,
        { ids: withOrder.map((product) => product.id) },
        { headers: getAuthHeaders() }
      );
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to save new order.");
      fetchProducts();
    }
  };

  const columns = [
    {
      key: "order",
      label: "",
      width: "48px",
      render: () => <GripVertical className="h-4 w-4 text-slate-300" aria-hidden="true" />,
    },
    {
      key: "image",
      label: "Image",
      render: (value, row) => {
        const src = getMediaUrl(value || row.front_image);

        return (
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-100">
            {src ? (
              <img
                src={src}
                alt={row.title || "Product image"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-slate-400">
                No image
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: "title",
      label: "Title",
      render: (value) => (
        <p className="max-w-70 truncate font-black text-slate-950">
          {value || "N/A"}
        </p>
      ),
    },
    {
      key: "slug",
      label: "Slug",
      render: (value) => (
        <p className="max-w-50 truncate text-sm font-semibold text-slate-600">
          {value || "N/A"}
        </p>
      ),
    },
    {
      key: "published",
      label: "Status",
      render: (value) => (
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-black ring-1 ring-inset ${
            value
              ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
              : "bg-slate-100 text-slate-600 ring-slate-200"
          }`}
        >
          {value ? "Published" : "Draft"}
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
          <Link to={`/admin/products/edit/${row.id}`}>
            <Button
              size="sm"
              variant="secondary"
              icon={<Edit3 className="h-3.5 w-3.5" />}
              aria-label={`Edit product ${row.title}`}
            >
              Edit
            </Button>
          </Link>
          <Button
            size="sm"
            variant="danger"
            icon={<Trash2 className="h-3.5 w-3.5" />}
            onClick={() => setDeleteProduct(row)}
            aria-label={`Delete product ${row.title}`}
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
            CMS Products
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">Products</h1>
          <p className="mt-2 text-sm font-semibold text-slate-500">
            Manage product content, publishing state, and SEO metadata.
            Drag a row by its handle to reorder the Products menu on the site.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant="secondary"
            icon={<RefreshCw className="h-4 w-4" />}
            onClick={fetchProducts}
            disabled={isLoading}
          >
            Refresh
          </Button>
          <Link to="/admin/products/create">
            <Button icon={<Plus className="h-4 w-4" />}>Create Product</Button>
          </Link>
        </div>
      </section>

      <section className="grid gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-[1fr_220px]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            name="productSearch"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by title, slug, or metadata"
            className="[&_input]:pl-10"
          />
        </div>
        <Select
          name="productStatus"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          options={[
            { label: "All statuses", value: "all" },
            { label: "Published only", value: "published" },
            { label: "Draft only", value: "draft" },
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
        data={tableRows}
        isLoading={isLoading}
        emptyMessage="No products found."
        draggable
        onReorder={handleReorder}
      />

      <Popup
        isOpen={Boolean(deleteProduct)}
        title="Delete Product"
        description="This removes the selected product from the CMS."
        onClose={() => setDeleteProduct(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteProduct(null)}>
              Cancel
            </Button>
            <Button variant="danger" isLoading={isDeleting} onClick={handleDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm font-semibold leading-6 text-slate-600">
          Delete product{" "}
          <span className="font-black text-slate-950">
            {deleteProduct?.title || "this product"}
          </span>
          ?
        </p>
      </Popup>
    </div>
  );
}
