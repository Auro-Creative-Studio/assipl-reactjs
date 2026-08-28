import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  Cookie,
  FileText,
  Image as ImageIcon,
  Newspaper,
} from "lucide-react";
import {
  Button,
  Input,
  Popup,
  Select,
  Table,
  Textarea,
} from "../components/ui/uiExports";
import { getAuthHeaders } from "../utils/auth";
import { navItems } from "../components/layout/cmsNavItems";

const API_ROOT = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api"
).replace(/\/$/, "");

const UPLOAD_COUNT_ENDPOINT = `${API_ROOT}/uploads/count`;
const COOKIE_CONSENT_ENDPOINT = `${API_ROOT}/cookie-consents`;
const BLOG_ENDPOINT = `${API_ROOT}/blogs`;
const ENQUIRY_ENDPOINT = `${API_ROOT}/enquiries`;

const totalPagesCount =
  navItems.find((item) => item.label === "Pages")?.children?.length || 0;

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

export default function Dashboard() {
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [counts, setCounts] = useState({ media: 0, cookies: 0, blogs: 0 });
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [isSubmissionsLoading, setIsSubmissionsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsStatsLoading(true);

      const [mediaResult, cookieResult, blogResult] = await Promise.allSettled([
        axios.get(UPLOAD_COUNT_ENDPOINT, { headers: getAuthHeaders() }),
        axios.get(COOKIE_CONSENT_ENDPOINT, { headers: getAuthHeaders() }),
        axios.get(BLOG_ENDPOINT, { headers: getAuthHeaders() }),
      ]);

      setCounts({
        media:
          mediaResult.status === "fulfilled"
            ? mediaResult.value.data?.data?.total || 0
            : 0,
        cookies:
          cookieResult.status === "fulfilled"
            ? (cookieResult.value.data?.data || []).length
            : 0,
        blogs:
          blogResult.status === "fulfilled"
            ? (blogResult.value.data?.data || []).length
            : 0,
      });
      setIsStatsLoading(false);
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const fetchSubmissions = async () => {
      setIsSubmissionsLoading(true);

      try {
        const response = await axios.get(ENQUIRY_ENDPOINT, {
          headers: getAuthHeaders(),
        });
        const items = response.data?.data || [];

        setSubmissions(
          [...items]
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 5)
        );
      } catch {
        setSubmissions([]);
      } finally {
        setIsSubmissionsLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const stats = [
    {
      label: "Total Pages",
      value: totalPagesCount,
      sub: "CMS-managed pages",
      icon: FileText,
    },
    {
      label: "Media Assets",
      value: counts.media,
      sub: "Total images uploaded",
      icon: ImageIcon,
    },
    {
      label: "Cookie Consents",
      value: counts.cookies,
      sub: "Recorded consent entries",
      icon: Cookie,
    },
    {
      label: "Blogs",
      value: counts.blogs,
      sub: "Published & draft posts",
      icon: Newspaper,
    },
  ];

  const submissionColumns = [
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
      label: "Phone",
      render: (value) => (
        <span className="font-semibold text-slate-700">{value || "N/A"}</span>
      ),
    },
    // {
    //   key: "company_name",
    //   label: "Company",
    //   render: (value) => (
    //     <span className="font-semibold text-slate-700">{value || "N/A"}</span>
    //   ),
    // },
    {
      key: "created_at",
      label: "Submitted",
      render: (value) => (
        <span className="font-semibold text-slate-500">
          {formatDateTime(value)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-primary p-6 text-white shadow-sm md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-white/40">
              Overview
            </p>
            <h1 className="mt-3 max-w-3xl text-4xl font-black leading-none tracking-tight md:text-5xl">
              Manage content, media, and performance from one clean dashboard.
            </h1>
          </div>

          <Button
            variant="secondary"
            icon={<ArrowUpRight className="h-4 w-4" />}
            className="shrink-0"
            onClick={() => window.open("/", "_blank", "noopener,noreferrer")}
          >
            View Site
          </Button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, sub, icon: Icon }) => (
          <article
            key={label}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <p className="text-sm font-bold text-slate-500">{label}</p>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                <Icon className="h-5 w-5" />
              </span>
            </div>
            <h2 className="mt-3 text-3xl font-black text-slate-950">
              {label === "Total Pages" || !isStatsLoading ? value : "—"}
            </h2>
            <p className="mt-2 text-sm font-bold text-primary">{sub}</p>
          </article>
        ))}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-950">
              Recent Form Submissions
            </h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              Latest messages submitted through the public enquiry form.
            </p>
          </div>

          <Button variant="secondary" onClick={() => navigate("/admin/enquiries")}>
            View All
          </Button>
        </div>

        <div className="mt-5">
          <Table
            columns={submissionColumns}
            data={submissions}
            isLoading={isSubmissionsLoading}
            emptyMessage="No form submissions yet."
          />
        </div>
      </section>

      <Popup
        isOpen={isPopupOpen}
        title="Create CMS Content"
        description="Use this popup pattern for create, edit, confirm, and media workflows."
        onClose={() => setIsPopupOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsPopupOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsPopupOpen(false)}>
              Save Content
            </Button>
          </>
        }
      >
        <div className="grid gap-5">
          <Input
            label="Page Title"
            name="pageTitle"
            value="New landing page"
            onChange={() => undefined}
            required
          />

          <Select
            label="Content Type"
            name="contentType"
            value="page"
            onChange={() => undefined}
            options={[
              { label: "Page", value: "page" },
              { label: "Article", value: "article" },
              { label: "Media", value: "media" },
            ]}
          />

          <Textarea
            label="Summary"
            name="summary"
            value="Short description for the content item."
            onChange={() => undefined}
            rows={4}
          />
        </div>
      </Popup>
    </div>
  );
}
