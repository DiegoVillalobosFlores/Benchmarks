import { hydrateRoot } from "react-dom/client";
import { StrictMode } from "react";
import App from "@/routes/app/root";

//TODO: find a way to add routing
hydrateRoot(
  document,
  <StrictMode>
    <App {...window.clientProps} />
  </StrictMode>,
);
