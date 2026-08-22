import AuthCallback from "@/screens/AuthCallbackScreen";
import CommandCenterScreen from "@/screens/CommandCenterScreen";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <CommandCenterScreen />,
    },
    {
      /** OAuth redirect callback route matching the application redirect URL. */
      path: "/auth/callback",
      element: <AuthCallback />,
    },
  ],
  { basename: import.meta.env.BASE_URL },
);
