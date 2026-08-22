/** Compact skills line for map popups (e.g. `Refrig`). */
export function formatSkillsLabel(skillTags: string | undefined): string {
  if (skillTags == null || skillTags.length === 0) {
    return "—";
  }

  if (skillTags.includes("commercial_refrigeration")) {
    return "Refrig";
  }

  const firstTag = skillTags.split(";")[0]?.trim();
  if (firstTag == null || firstTag.length === 0) {
    return "—";
  }

  return firstTag.replace(/_/g, " ");
}
