import axios from "axios";
import {
  Check,
  FileText,
  Image as ImageIcon,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  UploadCloud,
  Video,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { getAuthHeaders } from "../../utils/auth";
import Button from "./Button";
import Popup from "./Popup";

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

const getExtension = (value = "") => {
  const cleanValue = String(value).split("?")[0].split("#")[0];
  const filename = cleanValue.split("/").pop() || "";
  const dotIndex = filename.lastIndexOf(".");

  return dotIndex >= 0 ? filename.slice(dotIndex).toLowerCase() : "";
};

const getFilenameFromUrl = (url = "") => {
  try {
    return decodeURIComponent(String(url).split("?")[0].split("/").pop() || "Selected media");
  } catch {
    return String(url).split("?")[0].split("/").pop() || "Selected media";
  }
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

  if (!textUrl || textUrl.startsWith("blob:")) {
    return textUrl;
  }

  if (textUrl.startsWith("/src/") || textUrl.startsWith("/assets/")) {
    return textUrl;
  }

  if (textUrl.startsWith("http")) {
    const uploadPath = getUploadPath(textUrl);

    if (uploadPath !== textUrl && uploadPath.startsWith("uploads/")) {
      return `${BACKEND_ORIGIN}/${uploadPath}`;
    }

    return textUrl;
  }

  return `${BACKEND_ORIGIN}/${textUrl.replace(/^\//, "")}`;
};

const getFileType = (media = {}) => {
  if (media.type) return media.type;

  const extension = getExtension(media.filename || media.url || "");

  if ([".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"].includes(extension)) {
    return "image";
  }

  if ([".mp4", ".webm"].includes(extension)) {
    return "video";
  }

  return "file";
};

const normalizeMediaItem = (item) => {
  if (!item) return null;

  if (typeof item === "string") {
    return {
      filename: getFilenameFromUrl(item),
      original_name: getFilenameFromUrl(item),
      type: getFileType({ url: item }),
      extension: getExtension(item),
      url: getUploadPath(item),
    };
  }

  return {
    ...item,
    filename: item.filename || item.original_name || getFilenameFromUrl(item.url),
    original_name: item.original_name || item.filename || getFilenameFromUrl(item.url),
    type: getFileType(item),
    extension: item.extension || getExtension(item.filename || item.url),
    url: getUploadPath(item.url || item.path || (item.filename ? `uploads/${item.filename}` : "")),
  };
};

const normalizeValue = (value, multiple) => {
  if (multiple) {
    return Array.isArray(value) ? value.map(normalizeMediaItem).filter(Boolean) : [];
  }

  const item = Array.isArray(value) ? value[0] : value;
  const normalizedItem = normalizeMediaItem(item);

  return normalizedItem ? [normalizedItem] : [];
};

const isSameMedia = (first, second) => {
  if (!first || !second) return false;

  return (
    first.filename === second.filename ||
    (first.url && second.url && first.url === second.url)
  );
};

const isPdfFile = (media) => {
  return String(media?.extension || "").toLowerCase() === ".pdf";
};

const formatBytes = (bytes = 0) => {
  if (!Number.isFinite(bytes) || bytes <= 0) return "";

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

const MediaPreview = ({ media, enablePdfPreview = false, className = "" }) => {
  if (!media) return null;

  if (media.type === "image") {
    return (
      <img
        src={getMediaPreviewUrl(media.url)}
        alt={media.original_name || media.filename}
        className={`h-full w-full object-contain ${className}`}
      />
    );
  }

  if (media.type === "video") {
    return (
      <video
        src={getMediaPreviewUrl(media.url)}
        controls={enablePdfPreview}
        className={`h-full w-full bg-slate-950 object-contain ${className}`}
      />
    );
  }

  if (isPdfFile(media) && enablePdfPreview) {
    return (
      <iframe
        src={getMediaPreviewUrl(media.url)}
        title={media.original_name || media.filename || "PDF preview"}
        className={`h-full w-full bg-white ${className}`}
      />
    );
  }

  return (
    <div className={`flex h-full w-full items-center justify-center bg-slate-50 ${className}`}>
      <FileText className="h-10 w-10 text-slate-400" />
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

export default function CmsMediaSelect({
  label = "Media",
  value = null,
  onChange,
  multiple = false,
  name = "",
  error = "",
  disabled = false,
  helperText = "Select media from uploads or upload a new file.",
  accept = ACCEPTED_FILE_TYPES,
  allowedType = "all",
  allowedExtensions = [],
  uploadHint = "JPG, PNG, WEBP, GIF, SVG, MP4, WEBM, or PDF",
}) {
  const uploadInputRef = useRef(null);
  const uploadPreviewUrlRef = useRef("");
  const [isOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [draftSelection, setDraftSelection] = useState([]);
  const [query, setQuery] = useState("");
  const [type, setType] = useState(allowedType === "all" ? "all" : allowedType);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadPreview, setUploadPreview] = useState(null);
  const [mediaError, setMediaError] = useState("");

  const selectedMedia = useMemo(() => normalizeValue(value, multiple), [value, multiple]);
  const hasSelection = selectedMedia.length > 0;

  const emitChange = (nextSelection) => {
    onChange?.(multiple ? nextSelection : nextSelection[0] || null, {
      name,
      value: multiple ? nextSelection : nextSelection[0] || null,
    });
  };

  const fetchFiles = async () => {
    setIsLoading(true);
    setMediaError("");

    try {
      const response = await axios.get(UPLOAD_ENDPOINT, {
        headers: getAuthHeaders(),
      });
      setFiles(response.data?.data || []);
    } catch (err) {
      setMediaError(err.response?.data?.message || err.message || "Failed to load media.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      void Promise.resolve().then(() => {
        setDraftSelection(selectedMedia);
        fetchFiles();
      });
    }
  }, [isOpen, selectedMedia]);

  useEffect(() => {
    return () => {
      if (uploadPreviewUrlRef.current) {
        URL.revokeObjectURL(uploadPreviewUrlRef.current);
      }
    };
  }, []);

  const resetUpload = () => {
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

  const closePopup = () => {
    setIsOpen(false);
    setMediaError("");
    resetUpload();
  };

  const filteredFiles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return files.filter((file) => {
      const fileType = getFileType(file);
      const matchesAllowedType = allowedType === "all" || fileType === allowedType;
      const matchesAllowedExtension =
        allowedExtensions.length === 0 ||
        allowedExtensions.includes(
          String(file.extension || getExtension(file.filename || file.url)).toLowerCase().replace(/^\./, "")
        );
      const matchesType = type === "all" || fileType === type;
      const matchesQuery =
        !normalizedQuery ||
        [file.filename, file.original_name, file.extension, file.type]
          .filter(Boolean)
          .some((item) => String(item).toLowerCase().includes(normalizedQuery));

      return matchesAllowedType && matchesAllowedExtension && matchesType && matchesQuery;
    });
  }, [files, query, type, allowedType, allowedExtensions]);

  const selectMedia = (media) => {
    const normalizedMedia = normalizeMediaItem(media);

    if (!normalizedMedia) return;

    if (!multiple) {
      setDraftSelection([normalizedMedia]);
      return;
    }

    setDraftSelection((currentSelection) => {
      const exists = currentSelection.some((item) => isSameMedia(item, normalizedMedia));

      return exists
        ? currentSelection.filter((item) => !isSameMedia(item, normalizedMedia))
        : [...currentSelection, normalizedMedia];
    });
  };

  const removeSelectedMedia = (media) => {
    emitChange(selectedMedia.filter((item) => !isSameMedia(item, media)));
  };

  const confirmSelection = () => {
    emitChange(draftSelection);
    closePopup();
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

    const selectedExtension = getExtension(selectedFile.name).toLowerCase().replace(/^\./, "");
    if (allowedExtensions.length > 0 && !allowedExtensions.includes(selectedExtension)) {
      setUploadFile(null);
      setUploadPreview(null);
      setMediaError(`Only ${allowedExtensions.map((extension) => `.${extension}`).join(", ")} files are supported.`);
      event.target.value = "";
      return;
    }

    setMediaError("");

    const previewUrl = URL.createObjectURL(selectedFile);
    uploadPreviewUrlRef.current = previewUrl;
    setUploadPreview(
      normalizeMediaItem({
        filename: selectedFile.name,
        original_name: selectedFile.name,
        type: selectedFile.type.startsWith("image/")
          ? "image"
          : selectedFile.type.startsWith("video/")
            ? "video"
            : "file",
        extension: getExtension(selectedFile.name),
        size: selectedFile.size,
        url: previewUrl,
      })
    );
  };

  const handleUpload = async (event) => {
    event?.preventDefault?.();
    event?.stopPropagation?.();

    if (!uploadFile) {
      setMediaError("Choose a file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("file", uploadFile);

    setIsUploading(true);
    setMediaError("");

    try {
      const response = await axios.post(UPLOAD_ENDPOINT, formData, {
        headers: getAuthHeaders(),
      });
      const nextFile = normalizeMediaItem(response.data?.data);

      if (nextFile) {
        setFiles((currentFiles) => [nextFile, ...currentFiles]);
        setDraftSelection((currentSelection) => (multiple ? [...currentSelection, nextFile] : [nextFile]));
      }

      resetUpload();
    } catch (err) {
      setMediaError(err.response?.data?.message || err.message || "Failed to upload media.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="grid gap-2">
      {label && (
        <label className="text-sm font-bold text-slate-500">
          {label}
        </label>
      )}

      {hasSelection ? (
        <div className="grid gap-3">
          <div className={multiple ? "grid gap-3 sm:grid-cols-2" : "grid gap-3"}>
            {selectedMedia.map((media) => (
              <div
                key={media.url || media.filename}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="aspect-video bg-slate-50">
                  <MediaPreview
                    media={media}
                    enablePdfPreview={!multiple}
                    className={media.type === "image" ? "object-contain" : ""}
                  />
                </div>
                <div className="grid gap-3 p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-slate-950">
                      {media.filename}
                    </p>
                    <p className="mt-1 truncate text-xs font-semibold text-slate-500">
                      {media.extension || getTypeMeta(media.type).label}
                      {media.size ? ` / ${formatBytes(media.size)}` : ""}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <TypeBadge type={media.type} />
                    <Button
                      size="sm"
                      variant="danger"
                      icon={<Trash2 className="h-3.5 w-3.5" />}
                      onClick={() => removeSelectedMedia(media)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="secondary"
            disabled={disabled}
            icon={<RefreshCw className="h-4 w-4" />}
            onClick={() => setIsOpen(true)}
          >
            {multiple ? "Replace Media" : "Replace Media"}
          </Button>
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(true)}
          className={`
            flex min-h-30 flex-col items-center justify-center rounded-xl border border-dashed
            bg-white px-5 py-6 text-center shadow-sm transition
            ${error ? "border-rose-400" : "border-slate-300 hover:border-slate-500 hover:bg-slate-50"}
            ${disabled ? "cursor-not-allowed bg-slate-50 opacity-60" : "cursor-pointer"}
          `}
        >
          <Plus className="h-8 w-8 text-slate-500" />
          <span className="mt-3 text-sm font-black text-slate-950">
            Select Media
          </span>
          <span className="mt-1 text-xs font-semibold text-slate-500">
            {helperText}
          </span>
        </button>
      )}

      {error && <span className="text-xs font-semibold text-rose-600">{error}</span>}

      <Popup
        isOpen={isOpen}
        title={multiple ? "Select Media" : hasSelection ? "Replace Media" : "Select Media"}
        description="Choose from uploaded media or upload a new file."
        onClose={closePopup}
        size="xl"
        footer={
          <>
            <Button variant="secondary" onClick={closePopup}>
              Cancel
            </Button>
            <Button
              icon={<Check className="h-4 w-4" />}
              disabled={draftSelection.length === 0}
              onClick={confirmSelection}
            >
              Use Selected
            </Button>
          </>
        }
      >
        <div className="grid gap-5">
          <div className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <label className="flex min-h-30 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-5 py-6 text-center shadow-sm transition hover:border-slate-500 hover:bg-slate-50">
              <UploadCloud className="h-8 w-8 text-slate-500" />
              <span className="mt-3 max-w-full truncate text-sm font-black text-slate-950">
                {uploadFile?.name || "Upload new media"}
              </span>
              <span className="mt-1 text-xs font-semibold text-slate-500">
                {uploadHint}
              </span>
              <input
                ref={uploadInputRef}
                type="file"
                accept={accept}
                disabled={isUploading}
                onChange={handleUploadFileChange}
                className="sr-only"
              />
            </label>

            {uploadPreview && (
              <div className="grid gap-3">
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                  <div className={isPdfFile(uploadPreview) ? "h-90" : "aspect-video max-h-90"}>
                    <MediaPreview
                      media={uploadPreview}
                      enablePdfPreview
                      className={uploadPreview.type === "image" ? "object-contain" : ""}
                    />
                  </div>
                </div>
                <Button type="button" isLoading={isUploading} disabled={!uploadFile} onClick={handleUpload}>
                  Upload and Select
                </Button>
              </div>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search media..."
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-10 text-sm font-semibold text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10"
              />
            </div>
            <select
              value={type}
              onChange={(event) => setType(event.target.value)}
              disabled={allowedType !== "all"}
              className="h-10 rounded-lg border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-950 shadow-sm outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10"
            >
              {typeOptions
                .filter((option) => allowedType === "all" || option.value === "all" || option.value === allowedType)
                .map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
            </select>
            <Button
              variant="secondary"
              icon={<RefreshCw className="h-4 w-4" />}
              onClick={fetchFiles}
              disabled={isLoading}
            >
              Refresh
            </Button>
          </div>

          {mediaError && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600">
              {mediaError}
            </div>
          )}

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
              {filteredFiles.map((file) => {
                const normalizedFile = normalizeMediaItem(file);
                const isSelected = draftSelection.some((item) => isSameMedia(item, normalizedFile));

                return (
                  <button
                    key={normalizedFile.filename}
                    type="button"
                    onClick={() => selectMedia(normalizedFile)}
                    className={`
                      group relative aspect-square overflow-hidden rounded-xl border bg-white text-left shadow-sm transition
                      hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-900/10
                      ${isSelected ? "border-emerald-500 ring-2 ring-emerald-500/20" : "border-slate-200 hover:border-slate-300"}
                    `}
                  >
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
                      <MediaPreview
                        media={normalizedFile}
                        className={normalizedFile.type === "image" ? "object-contain" : ""}
                      />
                      {isSelected && (
                        <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm">
                          <Check className="h-4 w-4" />
                        </span>
                      )}
                    </div>
                    <div className="absolute inset-x-0 bottom-0 z-10 grid gap-2 bg-white/95 p-3 backdrop-blur">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-black text-slate-950">
                          {normalizedFile.filename}
                        </p>
                        <p className="mt-1 truncate text-xs font-semibold text-slate-500">
                          {normalizedFile.extension || "media"}
                          {normalizedFile.size ? ` / ${formatBytes(normalizedFile.size)}` : ""}
                        </p>
                      </div>
                      <div className="min-w-0 [&>span]:max-w-full [&>span]:justify-center">
                        <TypeBadge type={normalizedFile.type} />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {draftSelection.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-sm font-black text-slate-950">
                  Selected {draftSelection.length}
                </p>
                <button
                  type="button"
                  onClick={() => setDraftSelection([])}
                  className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-500 transition hover:text-rose-600"
                >
                  <X className="h-3.5 w-3.5" />
                  Clear
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {draftSelection.map((media) => (
                  <span
                    key={media.url || media.filename}
                    className="inline-flex max-w-full items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-500 ring-1 ring-inset ring-slate-200"
                  >
                    <span className="max-w-55 truncate">{media.filename}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setDraftSelection((currentSelection) =>
                          currentSelection.filter((item) => !isSameMedia(item, media))
                        )
                      }
                      className="text-slate-400 transition hover:text-rose-600"
                      aria-label={`Remove ${media.filename}`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </Popup>
    </div>
  );
}

