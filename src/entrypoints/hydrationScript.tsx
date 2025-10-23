import { hydrateRoot } from "react-dom/client";
import App from "../routes/app/root";

//TODO: find a way to add routing
hydrateRoot(document, <App {...window.clientProps} />);
