import { hydrateRoot } from "react-dom/client";
import { StrictMode } from "react";
import BenchmarksPage from "@/components/BenchmarksPage/BenchmarksPage";

//TODO: find a way to add routing
hydrateRoot(
  document,
  <StrictMode>
    <BenchmarksPage {...window.clientProps} />
  </StrictMode>,
);
