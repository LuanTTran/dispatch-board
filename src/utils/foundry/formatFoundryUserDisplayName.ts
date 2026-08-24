import type { User } from "@osdk/foundry.admin";

/** Prefer Foundry username, then given + family name, then email. */
export function formatFoundryUserDisplayName(user: User): string {
  if (user.username.length > 0) {
    return user.username;
  }

  const fullName = [user.givenName, user.familyName]
    .filter((part): part is string => part != null && part.length > 0)
    .join(" ")
    .trim();

  if (fullName.length > 0) {
    return fullName;
  }

  return user.email ?? user.id;
}
