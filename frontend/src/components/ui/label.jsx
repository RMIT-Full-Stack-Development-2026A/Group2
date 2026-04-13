export function Label({ className = "", ...props }) {
  return <label className={`form-label mb-1 ${className}`.trim()} {...props} />;
}
