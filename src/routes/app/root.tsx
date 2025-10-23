import BenchmarkSection from "@/components/BenchmarkSection/BenchmarkSection";
import Page from "@/components/Page/Page";
import AppAssetMap from "@/types/AppAssetMap";
import { ComponentProps, ReactNode } from "react";

type Props = {
  assetMap: AppAssetMap;
  benchmarks: ComponentProps<typeof BenchmarkSection>["benchmarks"];
};

export default function App({ assetMap, benchmarks }: Props) {
  return (
    <Page
      assetMap={assetMap}
      title="Benchmarks"
      header={<h1>Welcome to Benchmarks</h1>}
    >
      <nav>
        <h3>Controls:</h3>
        <ul
          style={{
            display: "flex",
          }}
        >
          <li>
            <p>⬆️</p>
          </li>
          <li>
            <p>⬇️</p>
          </li>
        </ul>
      </nav>
      <BenchmarkSection benchmarks={benchmarks} />
    </Page>
  );
}
