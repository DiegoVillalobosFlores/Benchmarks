import AppAssetMap from "@/types/AppAssetMap";
import { ReactNode } from "react";
import PageBody from "./PageBody";

type Props = {
  assetMap: AppAssetMap;
  children: ReactNode;
  title: string;
  header: ReactNode;
};

export default function Page({ assetMap, children, title, header }: Props) {
  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/svg+xml" href={assetMap.favicon} />
        <link rel="stylesheet" href={assetMap.globalStyles} />
        <title>{title}</title>
      </head>
      <PageBody>
        <header>{header}</header>
        <br />
        <br />
        <main>{children}</main>
      </PageBody>
    </html>
  );
}
