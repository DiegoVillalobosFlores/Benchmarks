import AppAssetMap from "@/types/AppAssetMap";
import { ReactNode } from "react";
import PageBody from "./PageBody";

type Props = {
  assetMap: AppAssetMap;
  children: ReactNode;
  title: string;
  header: ReactNode;
  navigation: ReactNode;
};

export default function Page({
  assetMap,
  children,
  title,
  header,
  navigation,
}: Props) {
  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/svg+xml" href={assetMap.favicon} />
        <link rel="stylesheet" href={assetMap.globalStyles} />
        <style>{`
          @font-face {
              font-family: "Quicksand";
              font-optical-sizing: auto;
              font-weight: 200;
              font-style: normal;
              font-display: swap;
              src: url(${assetMap.font}) format(woff2);
          }

          * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              font-family: "Quicksand", sans-serif;
              font-optical-sizing: auto;
              font-style: normal;
          }
          `}</style>
        <title>{title}</title>
      </head>
      <PageBody>
        <header>{header}</header>
        {navigation}
        <main>{children}</main>
      </PageBody>
    </html>
  );
}
