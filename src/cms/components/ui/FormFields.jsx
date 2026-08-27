import { useEffect, useRef, useState } from "react";

const fieldBaseClasses = `
  w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-950
  shadow-sm outline-none transition duration-200 placeholder:text-slate-400
  focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10
  disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-50
  disabled:text-slate-400
`

const getFieldStateClasses = (error) =>
  error
    ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/15"
    : "border-slate-200 hover:border-slate-300"

const Label = ({ label, name, required }) => {
  if (!label) return null

  return (
    <label htmlFor={name} className="text-sm font-bold text-slate-700">
      {label}
      {required && <span className="ml-1 text-rose-500">*</span>}
    </label>
  )
}

const ErrorText = ({ error }) => {
  if (!error) return null

  return (
    <span className="text-xs font-semibold text-rose-600">
      {error}
    </span>
  )
}

export const Input = ({
  label,
  name,
  type = "text",
  placeholder = "",
  value,
  onChange,
  error = "",
  required = false,
  disabled = false,
  className = "",
  ...rest
}) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <Label label={label} name={name} required={required} />
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`${fieldBaseClasses} ${getFieldStateClasses(error)}`}
        {...rest}
      />
      <ErrorText error={error} />
    </div>
  );
};


export const Select = ({
  label,
  name,
  options = [],
  value,
  onChange,
  error = "",
  placeholder = "Select an option",
  required = false,
  disabled = false,
  className = "",
}) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <Label label={label} name={name} required={required} />
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`${fieldBaseClasses} ${getFieldStateClasses(error)} cursor-pointer appearance-none`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 14px center",
          paddingRight: "36px",
        }}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ErrorText error={error} />
    </div>
  );
};


export const Textarea = ({
  label,
  name,
  placeholder = "",
  value,
  onChange,
  error = "",
  required = false,
  disabled = false,
  rows = 4,
  className = "",
}) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <Label label={label} name={name} required={required} />
      <textarea
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        rows={rows}
        className={`${fieldBaseClasses} ${getFieldStateClasses(error)} min-h-28 resize-y leading-relaxed`}
      />
      <ErrorText error={error} />
    </div>
  );
};

export const FileUpload = ({
  label,
  name,
  accept = "image/*",
  multiple = false,
  onChange,
  error = "",
  required = false,
  disabled = false,
  helperText = "PNG, JPG, WEBP or GIF up to 10MB",
  className = "",
}) => {
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    const nextPreviews = files
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }));

    setPreviews(nextPreviews);

    return () => {
      nextPreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [files]);

  const handleChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);

    setFiles(selectedFiles);
    onChange?.(event, selectedFiles);
  };

  const clearFiles = () => {
    setFiles([]);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <Label label={label} name={name} required={required} />

      <label
        htmlFor={name}
        className={`
          flex min-h-38 cursor-pointer flex-col items-center justify-center rounded-xl
          border border-dashed bg-white px-5 py-6 text-center shadow-sm transition duration-200
          ${error ? "border-rose-400" : "border-slate-300 hover:border-slate-500 hover:bg-slate-50"}
          ${disabled ? "cursor-not-allowed bg-slate-50 opacity-60" : ""}
        `}
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-lg font-black text-white">
          +
        </span>
        <span className="mt-3 text-sm font-black text-slate-950">
          Upload files
        </span>
        <span className="mt-1 text-xs font-semibold text-slate-500">
          {helperText}
        </span>
      </label>

      <input
        ref={inputRef}
        id={name}
        name={name}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={handleChange}
        className="sr-only"
      />

      {previews.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {previews.map((preview) => (
            <div
              key={`${preview.file.name}-${preview.file.lastModified}`}
              className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
            >
              <img
                src={preview.url}
                alt={preview.file.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-slate-950/75 p-2 text-left">
                <p className="truncate text-[11px] font-bold text-white">
                  {preview.file.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <button
          type="button"
          onClick={clearFiles}
          className="self-start text-xs font-black uppercase tracking-widest text-slate-500 transition hover:text-rose-600"
        >
          Clear files
        </button>
      )}

      <ErrorText error={error} />
    </div>
  );
};
