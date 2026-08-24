import { createContext, useContext, useMemo } from "react";
import type { User } from "@osdk/foundry.admin";
import { useCurrentFoundryUser } from "@osdk/react/platform-apis";
import { useMultipassCurrentUser } from "@/hooks/useMultipassCurrentUser";
import { formatFoundryUserDisplayName } from "@/utils/foundry/formatFoundryUserDisplayName";
import { indexActorUsername } from "@/utils/foundry/resolveFoundryActorLabel";

type FoundryCurrentUserContextValue = {
  currentUser: User | undefined;
  /** Foundry user id / UUID → username for activity actors. */
  displayNameByUserId: ReadonlyMap<string, string>;
};

const FoundryCurrentUserContext = createContext<FoundryCurrentUserContextValue | null>(null);

type FoundryCurrentUserProviderProps = {
  children: React.ReactNode;
};

/** Usernames for activity actors. Multipass `/me` does not need api:admin-read. */
export function FoundryCurrentUserProvider({
  children,
}: FoundryCurrentUserProviderProps): React.ReactElement {
  const { currentUser } = useCurrentFoundryUser();
  const multipassUser = useMultipassCurrentUser();

  const displayNameByUserId = useMemo(() => {
    const names = new Map<string, string>();
    if (multipassUser != null) {
      indexActorUsername(names, multipassUser.id, multipassUser.username);
    }
    if (currentUser != null) {
      indexActorUsername(names, currentUser.id, formatFoundryUserDisplayName(currentUser));
    }
    return names;
  }, [multipassUser, currentUser]);

  const value = useMemo(
    () => ({ currentUser, displayNameByUserId }),
    [currentUser, displayNameByUserId],
  );

  return (
    <FoundryCurrentUserContext.Provider value={value}>
      {children}
    </FoundryCurrentUserContext.Provider>
  );
}

export function useFoundryCurrentUser(): FoundryCurrentUserContextValue {
  const context = useContext(FoundryCurrentUserContext);
  if (context === null) {
    throw new Error("useFoundryCurrentUser must be used within FoundryCurrentUserProvider");
  }
  return context;
}
