export function Badge({ variant = "default", className = "", ...props }) {
  const variantClass = variant === "secondary" ? "text-bg-secondary" : "text-bg-light";
  return <span className={`badge ${variantClass} ${className}`.trim()} {...props} />;
}
