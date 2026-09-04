import axios from "axios";
import {
  Copy,
  ExternalLink,
  FileText,
  FileUp,
  Image as ImageIcon,
  RefreshCw,
  Search,
  Trash2,
  UploadCloud,
  Video,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Input, Popup, Select } from "../components/ui/uiExports";
import { getAuthHeaders } from "../utils/auth";

const API_ROOT = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api"
).replace(/\/$/, "");

const UPLOAD_ENDPOINT = `${API_ROOT}/uploads`;
const ACCEPTED_FILE_TYPES = "image/*,video/mp4,video/webm,application/pdf";
const BACKEND_ORIGIN = (import.meta.env.VITE_MEDIA_BASE_URL || API_ROOT.replace(/\/api$/, "")).replace(/\/$/, "");

const typeOptions = [
  { label: "All media", value: "all" },
  { label: "Images", value: "image" },
  { label: "Videos", value: "video" },
  { label: "Documents", value: "file" },
];

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

const formatBytes = (bytes = 0) => {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";

  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** index;

  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
};

const getTypeMeta = (type) => {
  if (type === "image") {
    return {
      label: "Image",
      icon: <ImageIcon className="h-4 w-4" />,
      className: "bg-sky-50 text-sky-700 ring-sky-200",
    };
  }

  if (type === "video") {
    return {
      label: "Video",
      icon: <Video className="h-4 w-4" />,
      className: "bg-violet-50 text-violet-700 ring-violet-200",
    };
  }

  return {
    label: "Document",
    icon: <FileText className="h-4 w-4" />,
    className: "bg-amber-50 text-amber-700 ring-amber-200",
  };
};

const copyToClipboard = async (value) => {
  if (!value) return;

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
};

const isPdfFile = (file) => {
  return String(file?.extension || "").toLowerCase() === ".pdf";
};

const getUploadPath = (value = "") => {
  const textValue = String(value || "").trim();

  if (!textValue || textValue.startsWith("blob:")) return textValue;

  const cleanPath = (path) => path.replace(/^\/+/, "").replace(/^api\/uploads\//, "uploads/");

  try {
    const url = new URL(textValue);
    const uploadPath = cleanPath(url.pathname);
    return uploadPath || textValue;
  } catch {
    return cleanPath(textValue);
  }
};

const getMediaPreviewUrl = (url = "") => {
  const textUrl = String(url || "");

  if (!textUrl || textUrl.startsWith("blob:")) return textUrl;
  if (textUrl.startsWith("http")) {
    const uploadPath = getUploadPath(textUrl);

    if (uploadPath !== textUrl && uploadPath.startsWith("uploads/")) {
      return `${BACKEND_ORIGIN}/${uploadPath}`;
    }

    return textUrl;
  }

  return `${BACKEND_ORIGIN}/${textUrl.replace(/^\//, "")}`;
};

const normalizeMediaFile = (file) => {
  if (!file) return null;

  return {
    ...file,
    url: getUploadPath(file.url || file.path || (file.filename ? `uploads/${file.filename}` : "")),
  };
};

const MediaPreview = ({ file, className = "", enablePdfPreview = false }) => {
  if (!file) return null;

  if (file.type === "image") {
    return (
      <img
        src={getMediaPreviewUrl(file.url)}
        alt={file.original_name || file.filename}
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }

  if (file.type === "video") {
    return (
      <video
        src={getMediaPreviewUrl(file.url)}
        controls
        className={`h-full w-full bg-slate-950 object-contain ${className}`}
      />
    );
  }

  if (isPdfFile(file) && enablePdfPreview) {
    return (
      <iframe
        src={getMediaPreviewUrl(file.url)}
        title={file.original_name || file.filename || "PDF preview"}
        className={`h-full w-full bg-white ${className}`}
      />
    );
  }

  return (
    <div className={`flex h-full w-full items-center justify-center bg-slate-50 ${className}`}>
      <FileText className="h-12 w-12 text-slate-400" />
    </div>
  );
};

const TypeBadge = ({ type }) => {
  const meta = getTypeMeta(type);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-black ring-1 ring-inset ${meta.className}`}
    >
      {meta.icon}
      {meta.label}
    </span>
  );
};

const MediaCard = ({ file, onOpen }) => {
  return (
    <button
      type="button"
      onClick={() => onOpen(file)}
      className="group overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-900/10"
      aria-label={`View ${file.filename}`}
    >
      <div className="aspect-[16/9] bg-slate-50">
        <MediaPreview file={file} className={file.type === "image" ? "object-contain" : ""} />
      </div>
      <div className="grid gap-3 p-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-black text-slate-950">{file.filename}</p>
          <p className="mt-1 truncate text-xs font-semibold text-slate-500">
            {formatBytes(file.size)} / {formatDateTime(file.updated_at)}
          </p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <TypeBadge type={file.type} />
          <span className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition group-hover:bg-slate-50 group-hover:text-slate-950">
            <ExternalLink className="h-4 w-4" />
          </span>
        </div>
      </div>
    </button>
  );
};

const getLocalPreviewFile = (file, url) => {
  if (!file || !url) return null;

  const extension = `.${file.name.split(".").pop() || ""}`.toLowerCase();
  const type = file.type.startsWith("image/")
    ? "image"
    : file.type.startsWith("video/")
      ? "video"
      : "file";

  return {
    filename: file.name,
    original_name: file.name,
    type,
    extension,
    size: file.size,
    url,
  };
};

export default function Media() {
  const uploadInputRef = useRef(null);
  const replaceInputRef = useRef(null);
  const uploadPreviewUrlRef = useRef("");
  const replacePreviewUrlRef = useRef("");
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isReplacing, setIsReplacing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [isUploadPopupOpen, setIsUploadPopupOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadPreview, setUploadPreview] = useState(null);
  const [replaceFile, setReplaceFile] = useState(null);
  const [replacePreview, setReplacePreview] = useState(null);
  const [viewFile, setViewFile] = useState(null);
  const [deleteFile, setDeleteFile] = useState(null);

  const fetchFiles = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.get(UPLOAD_ENDPOINT, {
        headers: getAuthHeaders(),
      });
      setFiles((response.data?.data || []).map(normalizeMediaFile).filter(Boolean));
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load media files.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(fetchFiles);
  }, []);

  useEffect(() => {
    return () => {
      if (uploadPreviewUrlRef.current) {
        URL.revokeObjectURL(uploadPreviewUrlRef.current);
      }

      if (replacePreviewUrlRef.current) {
        URL.revokeObjectURL(replacePreviewUrlRef.current);
      }
    };
  }, []);

  const filteredFiles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return files.filter((file) => {
      const matchesType = type === "all" || file.type === type;
      const matchesQuery =
        !normalizedQuery ||
        [file.filename, file.original_name, file.extension, file.type]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(normalizedQuery));

      return matchesType && matchesQuery;
    });
  }, [files, query, type]);

  const stats = useMemo(
    () => ({
      total: files.length,
      images: files.filter((file) => file.type === "image").length,
      videos: files.filter((file) => file.type === "video").length,
      documents: files.filter((file) => file.type === "file").length,
    }),
    [files]
  );

  const resetUploadInput = () => {
    setUploadFile(null);
    setUploadPreview(null);

    if (uploadPreviewUrlRef.current) {
      URL.revokeObjectURL(uploadPreviewUrlRef.current);
      uploadPreviewUrlRef.current = "";
    }

    if (uploadInputRef.current) {
      uploadInputRef.current.value = "";
    }
  };

  const closeUploadPopup = () => {
    setIsUploadPopupOpen(false);
    resetUploadInput();
  };

  const handleUploadFileChange = (event) => {
    const selectedFile = event.target.files?.[0] || null;

    if (uploadPreviewUrlRef.current) {
      URL.revokeObjectURL(uploadPreviewUrlRef.current);
      uploadPreviewUrlRef.current = "";
    }

    setUploadFile(selectedFile);

    if (!selectedFile) {
      setUploadPreview(null);
      return;
    }

    const previewUrl = URL.createObjectURL(selectedFile);
    uploadPreviewUrlRef.current = previewUrl;
    setUploadPreview(getLocalPreviewFile(selectedFile, previewUrl));
  };

  const resetReplaceInput = () => {
    setReplacePreview(null);

    if (replacePreviewUrlRef.current) {
      URL.revokeObjectURL(replacePreviewUrlRef.current);
      replacePreviewUrlRef.current = "";
    }

    if (replaceInputRef.current) {
      replaceInputRef.current.value = "";
    }
  };

  const closeReplacePopup = () => {
    setReplaceFile(null);
    resetReplaceInput();
  };

  const handleReplaceFileChange = (event) => {
    const selectedFile = event.target.files?.[0] || null;

    if (replacePreviewUrlRef.current) {
      URL.revokeObjectURL(replacePreviewUrlRef.current);
      replacePreviewUrlRef.current = "";
    }

    setReplaceFile((currentFile) => ({
      ...currentFile,
      replacement: selectedFile,
    }));

    if (!selectedFile) {
      setReplacePreview(null);
      return;
    }

    const previewUrl = URL.createObjectURL(selectedFile);
    replacePreviewUrlRef.current = previewUrl;
    setReplacePreview(getLocalPreviewFile(selectedFile, previewUrl));
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!uploadFile) {
      setError("Choose a file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("file", uploadFile);

    setIsUploading(true);
    setError("");
    setNotice("");

    try {
      const response = await axios.post(UPLOAD_ENDPOINT, formData, {
        headers: getAuthHeaders(),
      });
      const nextFile = normalizeMediaFile(response.data?.data);

      if (nextFile) {
        setFiles((currentFiles) => [nextFile, ...currentFiles]);
      } else {
        await fetchFiles();
      }

      resetUploadInput();
      setIsUploadPopupOpen(false);
      setNotice("File uploaded successfully.");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to upload file.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleReplace = async (event) => {
    event.preventDefault();

    if (!replaceFile?.replacement) {
      setError("Choose a replacement file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", replaceFile.replacement);

    setIsReplacing(true);
    setError("");
    setNotice("");

    try {
      const response = await axios.put(
        `${UPLOAD_ENDPOINT}/${encodeURIComponent(replaceFile.filename)}`,
        formData,
        { headers: getAuthHeaders() }
      );
      const updatedFile = normalizeMediaFile(response.data?.data);

      setFiles((currentFiles) =>
        currentFiles.map((file) =>
          file.filename === replaceFile.filename ? updatedFile || file : file
        )
      );
      setReplaceFile(null);
      resetReplaceInput();
      setNotice("File replaced successfully.");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to replace file.");
    } finally {
      setIsReplacing(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteFile) return;

    setIsDeleting(true);
    setError("");
    setNotice("");

    try {
      await axios.delete(`${UPLOAD_ENDPOINT}/${encodeURIComponent(deleteFile.filename)}`, {
        headers: getAuthHeaders(),
      });
      setFiles((currentFiles) =>
        currentFiles.filter((file) => file.filename !== deleteFile.filename)
      );
      setDeleteFile(null);
      setViewFile(null);
      setNotice("File deleted successfully.");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to delete file.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCopyUrl = async (file) => {
    try {
      await copyToClipboard(getUploadPath(file.url));
      setNotice("File path copied.");
    } catch (err) {
      setError(err.message || "Failed to copy file URL.");
    }
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
            CMS Library
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">Media</h1>
          <p className="mt-2 text-sm font-semibold text-slate-500">
            Upload, preview, replace, copy, and remove uploaded media files.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant="secondary"
            icon={<RefreshCw className="h-4 w-4" />}
            onClick={fetchFiles}
            disabled={isLoading}
          >
            Refresh
          </Button>
        </div>
      </section>

      <section className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
            Total
          </p>
          <p className="mt-1 text-2xl font-black text-slate-950">{stats.total}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
            Images
          </p>
          <p className="mt-1 text-2xl font-black text-slate-950">{stats.images}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
            Videos
          </p>
          <p className="mt-1 text-2xl font-black text-slate-950">{stats.videos}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
            Documents
          </p>
          <p className="mt-1 text-2xl font-black text-slate-950">{stats.documents}</p>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="relative md:col-span-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              name="mediaSearch"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by filename, extension, or type"
              className="[&_input]:pl-10"
            />
          </div>
          <Select
            name="mediaType"
            value={type}
            onChange={(event) => setType(event.target.value || "all")}
            options={typeOptions}
            placeholder="Choose media type"
          />
          <Button
            fullWidth
            icon={<UploadCloud className="h-4 w-4" />}
            onClick={() => {
              setError("");
              setNotice("");
              setIsUploadPopupOpen(true);
            }}
            className="h-10 px-6"
          >
            Upload File
          </Button>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white py-16 text-slate-500">
            <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-slate-200 border-t-slate-950" />
            <p className="text-sm font-semibold">Loading media...</p>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-16 text-center text-sm font-semibold text-slate-400">
            No media files found.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {filteredFiles.map((file) => (
              <MediaCard key={file.filename} file={file} onOpen={setViewFile} />
            ))}
          </div>
        )}
      </section>

      {notice && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
          {notice}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600">
          {error}
        </div>
      )}

      <Popup
        isOpen={isUploadPopupOpen}
        title="Upload Media"
        description="Choose a supported media file and review it before uploading."
        onClose={closeUploadPopup}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={closeUploadPopup}>
              Cancel
            </Button>
            <Button isLoading={isUploading} disabled={!uploadFile} onClick={handleUpload}>
              Upload
            </Button>
          </>
        }
      >
        <form className="grid gap-4" onSubmit={handleUpload}>
          <label className="flex min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-5 py-6 text-center shadow-sm transition hover:border-slate-500 hover:bg-slate-50">
            <UploadCloud className="h-9 w-9 text-slate-500" />
            <span className="mt-3 max-w-full truncate text-sm font-black text-slate-950">
              {uploadFile?.name || "Choose file"}
            </span>
            <span className="mt-1 text-xs font-semibold text-slate-500">
              JPG, PNG, WEBP, GIF, SVG, MP4, WEBM, or PDF
            </span>
            <input
              ref={uploadInputRef}
              type="file"
              accept={ACCEPTED_FILE_TYPES}
              onChange={handleUploadFileChange}
              className="sr-only"
            />
          </label>

          {uploadPreview && (
            <div className="grid gap-3">
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                <div className="aspect-video max-h-[360px]">
                  <MediaPreview
                    file={uploadPreview}
                    enablePdfPreview
                    className={uploadPreview.type === "image" ? "object-contain" : ""}
                  />
                </div>
              </div>
              <div className="rounded-lg bg-slate-50 px-3 py-2">
                <p className="truncate text-sm font-black text-slate-950">
                  {uploadPreview.filename}
                </p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {getTypeMeta(uploadPreview.type).label} / {uploadPreview.extension} /{" "}
                  {formatBytes(uploadPreview.size)}
                </p>
              </div>
            </div>
          )}
        </form>
      </Popup>

      <Popup
        isOpen={Boolean(viewFile)}
        title={viewFile?.filename || "Media Preview"}
        description={`${getTypeMeta(viewFile?.type).label} / ${formatBytes(viewFile?.size)} / ${formatDateTime(viewFile?.updated_at)}`}
        onClose={() => setViewFile(null)}
        size="xl"
        footer={
          <>
            {viewFile?.url && (
              <a href={getMediaPreviewUrl(viewFile.url)} target="_blank" rel="noreferrer">
                <Button variant="secondary" icon={<ExternalLink className="h-4 w-4" />}>
                  Open
                </Button>
              </a>
            )}
            <Button variant="outline" icon={<Copy className="h-4 w-4" />} onClick={() => handleCopyUrl(viewFile)}>
              Copy URL
            </Button>
            <Button
              variant="outline"
              icon={<FileUp className="h-4 w-4" />}
              onClick={() => {
                setReplaceFile({ ...viewFile, replacement: null });
                setViewFile(null);
                resetReplaceInput();
              }}
            >
              Replace
            </Button>
            <Button
              variant="danger"
              icon={<Trash2 className="h-4 w-4" />}
              onClick={() => {
                setDeleteFile(viewFile);
                setViewFile(null);
              }}
            >
              Delete
            </Button>
            <Button onClick={() => setViewFile(null)}>Close</Button>
          </>
        }
      >
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
          <div className={isPdfFile(viewFile) ? "h-[68vh]" : "aspect-video max-h-[58vh]"}>
            <MediaPreview
              file={viewFile}
              enablePdfPreview
              className={viewFile?.type === "image" ? "object-contain" : ""}
            />
          </div>
        </div>
        {viewFile?.url && (
          <p className="mt-4 break-all rounded-lg bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-500">
            {viewFile.url}
          </p>
        )}
      </Popup>

      <Popup
        isOpen={Boolean(replaceFile)}
        title="Replace File"
        description="The existing file record will be replaced with the newly uploaded file."
        onClose={closeReplacePopup}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={closeReplacePopup}
            >
              Cancel
            </Button>
            <Button isLoading={isReplacing} disabled={!replaceFile?.replacement} onClick={handleReplace}>
              Replace
            </Button>
          </>
        }
      >
        <form className="grid gap-4" onSubmit={handleReplace}>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">
              Current file
            </p>
            <p className="mt-1 break-all text-sm font-black text-slate-950">
              {replaceFile?.filename}
            </p>
          </div>
          <label className="flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-5 py-6 text-center shadow-sm transition hover:border-slate-500 hover:bg-slate-50">
            <FileUp className="h-8 w-8 text-slate-500" />
            <span className="mt-3 max-w-full truncate text-sm font-black text-slate-950">
              {replaceFile?.replacement?.name || "Choose replacement file"}
            </span>
            <span className="mt-1 text-xs font-semibold text-slate-500">
              JPG, PNG, WEBP, GIF, SVG, MP4, WEBM, or PDF up to backend limit
            </span>
            <input
              ref={replaceInputRef}
              type="file"
              accept={ACCEPTED_FILE_TYPES}
              onChange={handleReplaceFileChange}
              className="sr-only"
            />
          </label>

          {replacePreview && (
            <div className="grid gap-3">
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                <div className="aspect-video max-h-[360px]">
                  <MediaPreview
                    file={replacePreview}
                    enablePdfPreview
                    className={replacePreview.type === "image" ? "object-contain" : ""}
                  />
                </div>
              </div>
              <div className="rounded-lg bg-slate-50 px-3 py-2">
                <p className="truncate text-sm font-black text-slate-950">
                  {replacePreview.filename}
                </p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {getTypeMeta(replacePreview.type).label} / {replacePreview.extension} /{" "}
                  {formatBytes(replacePreview.size)}
                </p>
              </div>
            </div>
          )}
        </form>
      </Popup>

      <Popup
        isOpen={Boolean(deleteFile)}
        title="Delete Media"
        description="This removes the uploaded file from storage."
        onClose={() => setDeleteFile(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteFile(null)}>
              Cancel
            </Button>
            <Button variant="danger" isLoading={isDeleting} onClick={handleDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm font-semibold leading-6 text-slate-500">
          Delete{" "}
          <span className="break-all font-black text-slate-950">{deleteFile?.filename}</span>?
        </p>
      </Popup>
    </div>
  );
}
