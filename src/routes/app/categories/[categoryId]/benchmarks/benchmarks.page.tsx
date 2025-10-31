import BenchmarksPage from "@/components/BenchmarksPage/BenchmarksPage";
import { ComponentProps } from "react";

type Props = ComponentProps<typeof BenchmarksPage>;

export default function Page({ benchmarks, assetLinks }: Props) {
  return <BenchmarksPage benchmarks={benchmarks} assetLinks={assetLinks} />;
}
