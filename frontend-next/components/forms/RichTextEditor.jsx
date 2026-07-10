"use client";

import { useMemo, useRef, useCallback } from "react";
import ReactQuill from "react-quill-new";
import { toast } from "react-hot-toast";
import api from "@/lib/api/axios";

export default function RichTextEditor({ value, onChange, placeholder }) {
  const quillRef = useRef(null);

  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/jpeg,image/png,image/webp");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      const allowed = ["image/jpeg", "image/png", "image/webp"];
      if (!allowed.includes(file.type)) {
        toast.error("Only JPG, PNG, WEBP allowed");
        return;
      }

      const loadingToast = toast.loading("Uploading image inside article...");

      try {
        const formData = new FormData();
        formData.append("image", file);

        const { data } = await api.post("/upload/image", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const quill = quillRef.current?.getEditor();
        if (quill) {
          const range = quill.getSelection(true);
          quill.insertEmbed(range.index, "image", data.imageUrl);
          quill.setSelection(range.index + 1);
        }
        toast.success("Image uploaded successfully!", { id: loadingToast });
      } catch {
        toast.error("Failed to upload image inside content", {
          id: loadingToast,
        });
      }
    };
  }, []);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, false] }],
          [{ size: ["small", false, "large", "huge"] }],
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ align: [] }],
          ["blockquote", "code-block"],
          ["link", "image"],
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
      history: {
        delay: 500,
        maxStack: 200,
        userOnly: true,
      },
    }),
    [imageHandler],
  );

  const formats = [
    "header",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "list",
    "align",
    "blockquote",
    "code-block",
    "link",
    "image",
  ];

  const cleanValue = useMemo(() => {
    if (!value) return "";
    if (value.includes("&lt;") || value.includes("&gt;")) {
      const txt = document.createElement("textarea");
      txt.innerHTML = value;
      return txt.value;
    }
    return value;
  }, [value]);

  return (
    <div className="rich-text-editor-wrapper w-full flex flex-col group/editor">
      <style>{`\n        .rich-text-editor-wrapper .quill {\n          border-radius: 12px;\n          overflow: hidden;\n          border: 1px solid #e5e7eb;\n          transition: all 0.2s ease-in-out;\n        }\n\n        .rich-text-editor-wrapper .quill:focus-within {\n          border-color: #3b82f6;\n          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);\n        }\n\n        .rich-text-editor-wrapper .ql-toolbar.ql-snow {\n          border: none !important;\n          border-bottom: 1px solid #f3f4f6 !important;\n          background-color: #f9fafb;\n          padding: 8px 12px !important;\n          display: flex;\n          flex-wrap: wrap;\n          gap: 4px;\n        }\n\n        .rich-text-editor-wrapper .ql-container.ql-snow {\n          border: none !important;\n          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif;\n          background-color: #ffffff;\n        }\n\n        .rich-text-editor-wrapper .ql-editor {\n          min-height: 220px;\n          max-height: 500px;\n          font-size: 0.875rem;\n          line-height: 1.6;\n          color: #374151;\n          padding: 14px 16px !important;\n          transition: all 0.2s ease-in-out;\n        }\n\n        .rich-text-editor-wrapper .ql-editor ul,\n        .rich-text-editor-wrapper .ql-editor ol {\n          padding-left: 1.5rem !important;\n        }\n\n        .rich-text-editor-wrapper .ql-editor blockquote {\n          border-left: 4px solid #ef4444 !important;\n          background-color: #f9fafb !important;\n          padding: 8px 16px !important;\n          color: #4b5563 !important;\n          font-style: italic !important;\n          margin: 12px 0 !important;\n          border-radius: 4px !important;\n        }\n\n        .rich-text-editor-wrapper .ql-editor pre {\n          background-color: #111827 !important;\n          color: #f9fafb !important;\n          border-radius: 8px !important;\n          padding: 12px !important;\n          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace !important;\n          font-size: 0.85rem !important;\n          margin: 12px 0 !important;\n        }\n\n        .rich-text-editor-wrapper .ql-editor img {\n          border-radius: 8px !important;\n          max-width: 100% !important;\n          margin: 12px 0 !important;\n          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05) !important;\n        }\n\n        .rich-text-editor-wrapper .ql-editor.ql-blank::before {\n          color: #9ca3af !important;\n          font-style: normal !important;\n          left: 16px !important;\n          font-size: 0.875rem !important;\n        }\n\n        .rich-text-editor-wrapper .ql-snow .ql-stroke {\n          stroke: #4b5563 !important;\n          stroke-width: 1.5px !important;\n        }\n\n        .rich-text-editor-wrapper .ql-snow .ql-fill {\n          fill: #4b5563 !important;\n        }\n\n        .rich-text-editor-wrapper .ql-snow .ql-picker {\n          color: #4b5563 !important;\n          font-size: 0.75rem !important;\n          font-weight: 500 !important;\n        }\n\n        .rich-text-editor-wrapper .ql-snow.ql-toolbar button:hover,\n        .rich-text-editor-wrapper .ql-snow.ql-toolbar button:focus,\n        .rich-text-editor-wrapper .ql-snow.ql-toolbar button.ql-active,\n        .rich-text-editor-wrapper .ql-snow.ql-toolbar .ql-picker-label:hover,\n        .rich-text-editor-wrapper .ql-snow.ql-toolbar .ql-picker-label.ql-active,\n        .rich-text-editor-wrapper .ql-snow.ql-toolbar .ql-picker-item:hover,\n        .rich-text-editor-wrapper .ql-snow.ql-toolbar .ql-picker-item.ql-selected {\n          color: #2563eb !important;\n        }\n\n        .rich-text-editor-wrapper .ql-snow.ql-toolbar button:hover .ql-stroke,\n        .rich-text-editor-wrapper .ql-snow.ql-toolbar button:focus .ql-stroke,\n        .rich-text-editor-wrapper .ql-snow.ql-toolbar button.ql-active .ql-stroke,\n        .rich-text-editor-wrapper .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke,\n        .rich-text-editor-wrapper .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke {\n          stroke: #2563eb !important;\n        }\n\n        .rich-text-editor-wrapper .ql-snow.ql-toolbar button:hover .ql-fill,\n        .rich-text-editor-wrapper .ql-snow.ql-toolbar button:focus .ql-fill,\n        .rich-text-editor-wrapper .ql-snow.ql-toolbar button.ql-active .ql-fill,\n        .rich-text-editor-wrapper .ql-snow.ql-toolbar .ql-picker-label:hover .ql-fill,\n        .rich-text-editor-wrapper .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-fill {\n          fill: #2563eb !important;\n        }\n      `}</style>

      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={cleanValue}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={
          placeholder || "Write your article structure and details here..."
        }
      />
    </div>
  );
}
