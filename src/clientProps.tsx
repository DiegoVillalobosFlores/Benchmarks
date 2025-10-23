import AppAssetMap from "./types/AppAssetMap";

type Props = Record<string, unknown>;

export default function clientProps(props: Props) {
  const serializedProps = Object.entries(props)
    .map(([key, value]) => `window.${key} = ${JSON.stringify(value)}`)
    .join(";");

  return serializedProps;
}
