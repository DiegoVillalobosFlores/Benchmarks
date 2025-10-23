import { hydrateRoot } from "react-dom/client";
import App from "../routes/app/index";
import BenchmarkSection from "@/components/BenchmarkSection/BenchmarkSection";

//TODO: find a way to add routing
hydrateRoot(
  document,
  <App assetMap={window.assetMap}>
    <BenchmarkSection benchmarks={window.benchmarks} />
  </App>,
);
