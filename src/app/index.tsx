import AppAssetMap from "@/types/AppAssetMap";

type Props = {
  assetMap: AppAssetMap;
};

export default function App({ assetMap }: Props) {
  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/svg+xml" href={assetMap.favicon} />
        <link rel="stylesheet" href={assetMap.globalStyles} />
        <title>Benchmarks</title>
      </head>
      <body>
        <h1>Welcome to Benchmarks</h1>
      </body>
    </html>
  );
}
