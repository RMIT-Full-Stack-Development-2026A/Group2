export function getAvatarInitials(username) {
  if (!username || typeof username !== "string") {
    return "?";
  }
  const trimmed = username.trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() : "?";
}

/** @param {string | null | undefined} iso */
export function formatMemberSince(iso) {
  if (!iso || typeof iso !== "string") {
    return "—";
  }
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return "—";
  }
  return d.toISOString().slice(0, 10);
}
