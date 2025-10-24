import { hydrateRoot } from "react-dom/client";
import { StrictMode } from "react";
import UploadPage from "@/components/UploadPage/UploadPage";

//TODO: find a way to add routing
hydrateRoot(
  document,
  <StrictMode>
    <UploadPage {...window.clientProps} />
  </StrictMode>,
);
