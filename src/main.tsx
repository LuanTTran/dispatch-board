import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { OsdkProvider } from "@osdk/react";
import { ThemeProvider } from "@/components/ThemeProvider";
import client from "./client";
import { router } from "./router";
import "./index.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement).render(
  <ThemeProvider>
    <OsdkProvider client={client}>
      <RouterProvider router={router} />
    </OsdkProvider>
  </ThemeProvider>,
);
