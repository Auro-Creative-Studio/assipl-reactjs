import { useState } from "react";
import { ArrowUpRight, Eye, FileText, Image, MousePointerClick, Users } from "lucide-react";
import {
  Button,
  CmsMediaSelect,
  Input,
  Popup,
  Select,
  Table,
  Textarea,
} from "../components/ui/uiExports";

const stats = [
  {
    label: "Published Pages",
    value: "18",
    change: "+4 this month",
    icon: FileText,
  },
  {
    label: "Media Assets",
    value: "246",
    change: "+38 uploaded",
    icon: Image,
  },
  {
    label: "Visitors",
    value: "42.8K",
    change: "+12.4% growth",
    icon: Users,
  },
  {
    label: "Clicks",
    value: "9.6K",
    change: "+8.1% growth",
    icon: MousePointerClick,
  },
];

const recentRows = [
  { id: 1, title: "Homepage Hero", type: "Page", owner: "Admin", status: "Published", updated: "Today" },
  { id: 2, title: "Growth Marketing Case Study", type: "Article", owner: "Priya", status: "Review", updated: "Yesterday" },
  { id: 3, title: "Services Gallery", type: "Media", owner: "Rahul", status: "Draft", updated: "May 7" },
  { id: 4, title: "Client Testimonials", type: "Section", owner: "Admin", status: "Published", updated: "May 6" },
];

const recentColumns = [
  {
    key: "title",
    label: "Content",
    render: (value) => (
      <span className="font-black text-slate-950">
        {value}
      </span>
    ),
  },
  { key: "type", label: "Type" },
  { key: "owner", label: "Owner" },
  {
    key: "status",
    label: "Status",
    render: (value) => {
      const styles = {
        Published: "bg-emerald-50 text-emerald-700 ring-emerald-200",
        Review: "bg-blue-50 text-blue-700 ring-blue-200",
        Draft: "bg-amber-50 text-amber-700 ring-amber-200",
      };

      return (
        <span className={`rounded-full px-2.5 py-1 text-xs font-black ring-1 ring-inset ${styles[value]}`}>
          {value}
        </span>
      );
    },
  },
  { key: "updated", label: "Updated" },
];

export default function Dashboard() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [singleMedia, setSingleMedia] = useState(null);
  const [galleryMedia, setGalleryMedia] = useState([]);

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
          >
            View Site
          </Button>
        </div>
      </section>

      {/* <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, change, icon: Icon }) => (
          <article key={label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-slate-500">{label}</p>
                <h2 className="mt-3 text-3xl font-black text-slate-950">{value}</h2>
              </div>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                <Icon className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-5 text-sm font-bold text-primary">{change}</p>
          </article>
        ))}
      </section> */}

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
            Component Preview
          </p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">
            CMS Media Select
          </h2>
          <p className="mt-2 text-sm font-semibold text-slate-500">
            Reference usage for single image/file fields and multiple gallery fields.
          </p>
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-2">
          <CmsMediaSelect
            label="Single Media"
            name="single_media_preview"
            value={singleMedia}
            onChange={setSingleMedia}
            helperText="Use this for OG image, featured image, or document fields."
          />

          <CmsMediaSelect
            label="Multiple Media Gallery"
            name="gallery_media_preview"
            multiple
            value={galleryMedia}
            onChange={setGalleryMedia}
            helperText="Use this for gallery, carousel, or portfolio media fields."
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
