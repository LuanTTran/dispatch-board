import { auth } from "@/client";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/** OAuth callback route. Completes sign-in and redirects to the home page. */
function AuthCallback(): React.ReactElement {
  const [error, setError] = useState<string | undefined>(undefined);
  const navigate = useNavigate();

  // Runs once on mount to finish OAuth. May run twice in React 18 strict mode during development.
  // https://react.dev/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development
  useEffect(() => {
    auth
      .signIn()
      .then(() => navigate("/", { replace: true }))
      .catch((e: unknown) => {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError(String(e));
        }
      });
  }, [navigate]);
  return <div>{error != null ? error : "Authenticating…"}</div>;
}

export default AuthCallback;
