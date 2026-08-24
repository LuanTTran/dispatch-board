import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { OsdkProvider } from "@osdk/react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import client from "./client";
import "./index.css";
import { router } from "./router";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement).render(
  <ThemeProvider>
    <OsdkProvider client={client}>
      <RouterProvider router={router} />
      <Toaster />
    </OsdkProvider>
  </ThemeProvider>,
);
