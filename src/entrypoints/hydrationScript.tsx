import { hydrateRoot } from "react-dom/client";
import App from "../app/index";

hydrateRoot(document, <App assetMap={window.assetMap} />);
