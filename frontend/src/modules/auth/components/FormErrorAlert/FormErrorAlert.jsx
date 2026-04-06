// Error alert: bullet list or one message.
export default function FormErrorAlert({ issues, message }) {
  if (issues?.length) {
    return (
      <div className="alert alert-danger py-3 px-3" role="alert">
        <div className="fw-semibold small text-uppercase text-danger-emphasis mb-2">
          Please fix the following
        </div>
        <ul className="small mb-0 ps-3" style={{ listStyleType: "disc" }}>
          {issues.map((item, i) => (
            <li key={i} className="mb-1">
              {item.message}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (!message) return null;

  const lines = message.split(/\n/).filter((l) => l.trim());
  const useList = lines.length > 1 && lines.every((l) => l.trim().startsWith("•"));

  if (useList) {
    return (
      <div className="alert alert-danger py-3 px-3" role="alert">
        <ul className="small mb-0 ps-3" style={{ listStyleType: "disc" }}>
          {lines.map((line, i) => (
            <li key={i} className="mb-1">
              {line.replace(/^\s*•\s*/, "")}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div
      className="alert alert-danger py-3 px-3 small"
      role="alert"
      style={{ whiteSpace: "pre-line", wordBreak: "break-word" }}
    >
      {message}
    </div>
  );
}
