import HomePage from "@/components/HomePage/HomePage";

type Props = {
  assetLinks: string[];
};

export default function Page({ assetLinks }: Props) {
  return <HomePage assetLinks={assetLinks} />;
}
