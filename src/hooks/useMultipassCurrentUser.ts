import { useState } from "react";
import { auth, foundryUrl } from "@/client";
import { useMountEffect } from "@/hooks/useMountEffect";

export type MultipassCurrentUser = {
  id: string;
  username: string;
};

type MultipassMeResponse = {
  id?: string;
  username?: string;
};

/** Current Multipass user. Works with the OAuth token; does not need api:admin-read. */
export function useMultipassCurrentUser(): MultipassCurrentUser | undefined {
  const [user, setUser] = useState<MultipassCurrentUser | undefined>();

  useMountEffect(() => {
    const abort = new AbortController();

    void auth()
      .then((token) =>
        fetch(`${foundryUrl}/multipass/api/me`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: abort.signal,
        }),
      )
      .then(async (response) => {
        if (!response.ok) {
          return undefined;
        }
        return (await response.json()) as MultipassMeResponse;
      })
      .then((body) => {
        if (body?.id == null || body.id.length === 0) {
          return;
        }
        if (body.username == null || body.username.length === 0) {
          return;
        }
        setUser({ id: body.id, username: body.username });
      })
      .catch(() => {
        // Token or network failure: activity rows keep the raw actor until Admin APIs load.
      });

    return () => abort.abort();
  });

  return user;
}
