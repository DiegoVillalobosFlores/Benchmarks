import { ReactNode } from "react";
import PageBody from "./PageBody";
import PageHRM from "./PageHRM";

type Props = {
  title: string;
  children: ReactNode;
  assetLinks: string[];
};

const styles =
  "*{box-sizing:border-box;font-optical-sizing:auto;margin:0;padding:0;font-family:system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Noto Sans,Ubuntu,Cantarell,Helvetica Neue;font-style:normal;font-weight:200}body{display:flex;color:#fff;background-color:#000;flex-direction:column;gap:16px;height:100dvh;padding:32px}main{display:contents;height:100%}section{display:contents}ul{list-style-type:none}";

export default function Page({ children, title, assetLinks }: Props) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Simple site to view, store and share all the benchmarks from different sources"
        />
        <link rel="icon" type="image/svg+xml" href={"favicon.svg"} />
        {assetLinks.map((link) => (
          <link
            key={link}
            rel={link.endsWith(".css") ? "stylesheet" : "preload"}
            href={link}
          />
        ))}
        <style>{styles}</style>
        <title>{title}</title>
      </head>
      <PageBody>{children}</PageBody>
      {process.env.NODE_ENV === "development" && <PageHRM />}
    </html>
  );
}
