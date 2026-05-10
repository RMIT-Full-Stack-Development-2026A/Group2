import { useId } from "react";

function readImage(file, onDone) {
  const reader = new FileReader();
  reader.onload = () => onDone(String(reader.result));
  reader.readAsDataURL(file);
}

export default function ImageUploadOption({
  label,
  preview,
  onUpload,
  onClear,
  selected,
  onSelect,
}) {
  const inputId = useId();

  return (
    <div className={`border rounded p-2 ${selected ? "border-primary" : ""}`}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <strong className="small">{label}</strong>
        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={onSelect}>
          Use
        </button>
      </div>

      {preview ? (
        <img
          src={preview}
          alt="board preview"
          className="w-100 rounded mb-2"
          style={{ aspectRatio: "1 / 1", objectFit: "cover" }}
        />
      ) : (
        <div className="border rounded d-flex align-items-center justify-content-center text-secondary mb-2" style={{ aspectRatio: "1 / 1" }}>
          No image
        </div>
      )}

      <label htmlFor={inputId} className="btn btn-sm btn-primary me-2">
        Upload
      </label>
      <input
        id={inputId}
        type="file"
        accept="image/*"
        className="d-none"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          readImage(file, onUpload);
          e.target.value = "";
        }}
      />
      <button type="button" className="btn btn-sm btn-outline-danger" onClick={onClear}>
        Clear
      </button>
    </div>
  );
}
