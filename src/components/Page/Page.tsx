import AppAssetMap from "@/types/AppAssetMap";
import { ReactNode } from "react";
import PageBody from "./PageBody";
import PageHRM from "./PageHRM";

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
        <link rel="preconnect" href={assetMap.font} as="font" />
        <link rel="icon" type="image/svg+xml" href={assetMap.favicon} />
        <link rel="preconnect" href={assetMap.globalStyles} as="style" />
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
              font-family: "Quicksand", system-ui;
              font-optical-sizing: auto;
              font-style: normal;
              font-weight: 200;
          }

          body {
              display: flex;
              flex-direction: column;
              height: 100dvh;
              background-color: black;
              color: white;
              padding: 32px;
              gap: 16px;
          }

          main {
              height: 100%
          }

          main {
              display: contents;
          }

          section {
              display: contents;
          }

          ul {
              list-style-type: none;
          }
          `}</style>
        <title>{title}</title>
      </head>
      <PageBody>
        <header>{header}</header>
        {navigation}
        <main>{children}</main>
      </PageBody>
      {process.env.NODE_ENV === "development" && <PageHRM />}
    </html>
  );
}
