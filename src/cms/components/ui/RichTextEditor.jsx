import {
  Bold,
  Check,
  Heading2,
  Italic,
  Link,
  List,
  ListOrdered,
  Pilcrow,
  RemoveFormatting,
  Underline,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const toolbarButtonClasses =
  "flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-900/10 disabled:cursor-not-allowed disabled:opacity-50";

const getPlainText = (html = "") => {
  const element = document.createElement("div");
  element.innerHTML = html;
  return element.textContent || element.innerText || "";
};

const normalizeHtml = (html = "") => {
  const normalizedHtml = html
    .replace(/<div><br><\/div>/gi, "")
    .replace(/<p><br><\/p>/gi, "")
    .replace(/<br>/gi, "")
    .trim();

  return getPlainText(normalizedHtml).trim() ? html : "";
};

export default function RichTextEditor({
  label,
  name,
  value = "",
  onChange,
  placeholder = "",
  error = "",
  required = false,
  disabled = false,
  minHeight = 220,
  className = "",
}) {
  const editorRef = useRef(null);
  const savedSelectionRef = useRef(null);
  const [isLinkPanelOpen, setIsLinkPanelOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const emitChange = () => {
    const nextValue = normalizeHtml(editorRef.current?.innerHTML || "");

    onChange?.({
      target: {
        name,
        value: nextValue,
      },
    });
  };

  const runCommand = (command, commandValue = null) => {
    if (disabled) return;

    restoreSelection();
    editorRef.current?.focus();
    document.execCommand(command, false, commandValue);
    emitChange();
  };

  const saveSelection = () => {
    const selection = window.getSelection();

    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);

    if (editorRef.current?.contains(range.commonAncestorContainer)) {
      savedSelectionRef.current = range.cloneRange();
    }
  };

  const restoreSelection = () => {
    const selection = window.getSelection();
    const range = savedSelectionRef.current;

    if (!selection || !range) return;

    selection.removeAllRanges();
    selection.addRange(range);
  };

  const openLinkPanel = () => {
    if (disabled) return;

    saveSelection();
    setLinkUrl("");
    setIsLinkPanelOpen(true);
  };

  const closeLinkPanel = () => {
    setIsLinkPanelOpen(false);
    setLinkUrl("");
  };

  const applyLink = () => {
    const normalizedUrl = linkUrl.trim();

    if (!normalizedUrl) return;

    const href = /^https?:\/\//i.test(normalizedUrl)
      ? normalizedUrl
      : `https://${normalizedUrl}`;

    runCommand("createLink", href);
    closeLinkPanel();
  };

  const handleLinkKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      applyLink();
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeLinkPanel();
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();

    const text = event.clipboardData?.getData("text/plain") || "";
    document.execCommand("insertText", false, text);
    emitChange();
  };

  const hasValue = Boolean(getPlainText(value).trim());

  return (
    <div className={`grid gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={name} className="text-sm font-bold text-slate-700">
          {label}
          {required && <span className="ml-1 text-rose-500">*</span>}
        </label>
      )}

      <div
        className={`overflow-hidden rounded-xl border bg-white shadow-sm transition ${
          error
            ? "border-rose-400 focus-within:border-rose-500 focus-within:ring-4 focus-within:ring-rose-500/15"
            : "border-slate-200 focus-within:border-slate-900 focus-within:ring-4 focus-within:ring-slate-900/10"
        }`}
      >
        <div className="relative flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 px-2 py-2">
          <button
            type="button"
            disabled={disabled}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => runCommand("formatBlock", "p")}
            className={toolbarButtonClasses}
            title="Paragraph"
            aria-label="Paragraph"
          >
            <Pilcrow className="h-4 w-4" />
          </button>
          <button
            type="button"
            disabled={disabled}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => runCommand("formatBlock", "h2")}
            className={toolbarButtonClasses}
            title="Heading"
            aria-label="Heading"
          >
            <Heading2 className="h-4 w-4" />
          </button>
          <span className="mx-1 h-6 w-px bg-slate-200" />
          <button
            type="button"
            disabled={disabled}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => runCommand("bold")}
            className={toolbarButtonClasses}
            title="Bold"
            aria-label="Bold"
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            type="button"
            disabled={disabled}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => runCommand("italic")}
            className={toolbarButtonClasses}
            title="Italic"
            aria-label="Italic"
          >
            <Italic className="h-4 w-4" />
          </button>
          <button
            type="button"
            disabled={disabled}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => runCommand("underline")}
            className={toolbarButtonClasses}
            title="Underline"
            aria-label="Underline"
          >
            <Underline className="h-4 w-4" />
          </button>
          <span className="mx-1 h-6 w-px bg-slate-200" />
          <button
            type="button"
            disabled={disabled}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => runCommand("insertUnorderedList")}
            className={toolbarButtonClasses}
            title="Bulleted list"
            aria-label="Bulleted list"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            type="button"
            disabled={disabled}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => runCommand("insertOrderedList")}
            className={toolbarButtonClasses}
            title="Numbered list"
            aria-label="Numbered list"
          >
            <ListOrdered className="h-4 w-4" />
          </button>
          <button
            type="button"
            disabled={disabled}
            onMouseDown={(event) => event.preventDefault()}
            onClick={openLinkPanel}
            className={toolbarButtonClasses}
            title="Add link"
            aria-label="Add link"
          >
            <Link className="h-4 w-4" />
          </button>
          <span className="mx-1 h-6 w-px bg-slate-200" />
          <button
            type="button"
            disabled={disabled}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => runCommand("removeFormat")}
            className={toolbarButtonClasses}
            title="Clear formatting"
            aria-label="Clear formatting"
          >
            <RemoveFormatting className="h-4 w-4" />
          </button>

          {isLinkPanelOpen && (
            <div
              className="absolute left-2 top-[calc(100%+8px)] z-20 grid w-[min(360px,calc(100vw-3rem))] gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-xl shadow-slate-950/15"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  Add Link
                </p>
                <button
                  type="button"
                  onClick={closeLinkPanel}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
                  aria-label="Close link popup"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <input
                value={linkUrl}
                onChange={(event) => setLinkUrl(event.target.value)}
                placeholder="https://example.com"
                autoFocus
                onKeyDown={handleLinkKeyDown}
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeLinkPanel}
                  className="inline-flex h-9 items-center justify-center rounded-lg bg-white px-3 text-xs font-black text-primary ring-1 ring-inset ring-primary transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={applyLink}
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-black text-white transition hover:bg-dark"
                >
                  <Check className="h-3.5 w-3.5" />
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          {!hasValue && placeholder && (
            <span className="pointer-events-none absolute left-4 top-3 text-sm font-semibold text-slate-400">
              {placeholder}
            </span>
          )}
          <div
            id={name}
            ref={editorRef}
            contentEditable={!disabled}
            suppressContentEditableWarning
            onInput={emitChange}
            onBlur={() => {
              saveSelection();
              emitChange();
            }}
            onKeyUp={saveSelection}
            onMouseUp={saveSelection}
            onPaste={handlePaste}
            className="prose prose-slate max-w-none px-4 py-3 text-sm font-medium leading-7 text-slate-800 outline-none [&_a]:font-bold [&_a]:text-primary [&_a]:underline [&_h2]:text-xl [&_h2]:font-black [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5"
            style={{ minHeight }}
          />
        </div>
      </div>

      {error && <span className="text-xs font-semibold text-rose-600">{error}</span>}
    </div>
  );
}
