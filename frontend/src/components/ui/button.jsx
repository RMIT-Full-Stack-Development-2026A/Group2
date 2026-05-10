function buttonClasses(variant, size) {
  const base = "btn";
  const variantMap = {
    default: "btn-primary",
    outline: "btn-outline-secondary",
    secondary: "btn-secondary",
    destructive: "btn-danger",
    ghost: "btn-link",
  };
  const sizeMap = {
    sm: "btn-sm",
    md: "",
    lg: "btn-lg",
  };

  return [base, variantMap[variant] || variantMap.default, sizeMap[size] || ""]
    .filter(Boolean)
    .join(" ");
}

export function Button({
  type = "button",
  variant = "default",
  size = "md",
  className = "",
  ...props
}) {
  return (
    <button
      type={type}
      className={`${buttonClasses(variant, size)} ${className}`.trim()}
      {...props}
    />
  );
}
