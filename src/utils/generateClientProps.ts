type Props = Record<string, unknown>;

export default function generateClientProps(props: Props) {
  const serializedProps = `window.clientProps = {
    ${Object.entries(props)
      .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
      .join(",\n")}
    };`;

  return serializedProps;
}
