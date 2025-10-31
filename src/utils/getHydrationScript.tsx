export default function getHydrationScript(entrypoint: string) {
  return `
  import { hydrateRoot } from "react-dom/client";
  import { StrictMode } from "react";
  import Component from "${entrypoint}";

  hydrateRoot(
    document,
    <StrictMode>
      <Component {...window.clientProps} />
    </StrictMode>,
  );
  `;
}
