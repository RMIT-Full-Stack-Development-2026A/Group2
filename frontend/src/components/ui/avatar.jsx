function cn(...parts) {
  return parts.filter(Boolean).join(" ");
}

export function Avatar({ className = "", ...props }) {
  return (
    <div
      className={cn(
        "rounded-circle border d-inline-flex align-items-center justify-content-center overflow-hidden",
        className,
      )}
      {...props}
    />
  );
}

export function AvatarFallback({ className = "", ...props }) {
  return (
    <div
      className={cn("w-100 h-100 d-flex align-items-center justify-content-center", className)}
      {...props}
    />
  );
}
