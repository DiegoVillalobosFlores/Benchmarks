import Page from "@/components/Page/Page";
import AppAssetMap from "@/types/AppAssetMap";
import { ReactNode } from "react";

type Props = {
  assetMap: AppAssetMap;
  children: ReactNode;
};

export default function App({ assetMap, children }: Props) {
  return (
    <Page
      assetMap={assetMap}
      title="Benchmarks"
      header={<h1>Welcome to Benchmarks</h1>}
    >
      {children}
    </Page>
  );
}
