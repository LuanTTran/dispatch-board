/** Bare UUID at the end of a Foundry user id or RID (`ri.sso.main.user.{uuid}`). */
const FOUNDRY_USER_UUID_SUFFIX =
  /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const FOUNDRY_USER_UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Map lookup key shared by Admin `User.id` and ontology `currentUser()` actor values. */
export function normalizeFoundryUserId(value: string): string {
  const match = value.match(FOUNDRY_USER_UUID_SUFFIX);
  return match?.[0]?.toLowerCase() ?? value;
}

export function isFoundryUserUuid(value: string): boolean {
  return FOUNDRY_USER_UUID.test(value);
}

/** Index both the raw id and the trailing UUID so RID and bare-id actors match. */
export function indexActorUsername(
  names: Map<string, string>,
  userId: string,
  username: string,
): void {
  if (username.length === 0) {
    return;
  }
  names.set(userId, username);
  names.set(normalizeFoundryUserId(userId), username);
}

/** Username from the map, else seed `coordinator.alice` → Alice. Never slug-split a RID. */
export function resolveFoundryActorLabel(
  actor: string,
  usernameByUserId?: ReadonlyMap<string, string>,
): string {
  const username =
    usernameByUserId?.get(actor) ?? usernameByUserId?.get(normalizeFoundryUserId(actor));
  if (username != null && username.length > 0) {
    return username;
  }

  if (actor.startsWith("coordinator.")) {
    const slug = actor.slice("coordinator.".length);
    return slug.charAt(0).toUpperCase() + slug.slice(1);
  }

  return actor;
}
