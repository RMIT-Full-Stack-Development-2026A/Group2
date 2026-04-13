function cn(...parts) {
  return parts.filter(Boolean).join(" ");
}

export function Alert({ variant = "default", className = "", ...props }) {
  const variantClass = variant === "destructive" ? "alert-danger" : "alert-secondary";
  return <div role="alert" className={cn("alert", variantClass, className)} {...props} />;
}

export function AlertDescription({ className = "", ...props }) {
  return <div className={cn(className)} {...props} />;
}
