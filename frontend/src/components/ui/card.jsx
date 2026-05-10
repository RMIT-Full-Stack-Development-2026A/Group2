function cn(...parts) {
  return parts.filter(Boolean).join(" ");
}

export function Card({ className = "", ...props }) {
  return <div className={cn("card border-0 shadow-sm", className)} {...props} />;
}

export function CardHeader({ className = "", ...props }) {
  return <div className={cn("card-header bg-white", className)} {...props} />;
}

export function CardTitle({ className = "", ...props }) {
  return <h5 className={cn("card-title mb-1", className)} {...props} />;
}

export function CardDescription({ className = "", ...props }) {
  return <p className={cn("text-secondary mb-0", className)} {...props} />;
}

export function CardContent({ className = "", ...props }) {
  return <div className={cn("card-body", className)} {...props} />;
}
