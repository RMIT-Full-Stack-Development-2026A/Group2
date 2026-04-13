export function getPlayerAvatarFallback(value) {
  if (!value) return "?";
  return value.charAt(0).toUpperCase();
}