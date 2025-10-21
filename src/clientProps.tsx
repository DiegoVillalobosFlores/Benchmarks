import AppAssetMap from "./types/AppAssetMap";

type Props = {
  assetMap: AppAssetMap;
};

export default function clientProps({ assetMap }: Props) {
  return `window.assetMap = ${JSON.stringify(assetMap)};`;
}
