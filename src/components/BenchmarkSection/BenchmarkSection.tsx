import { ComponentProps } from "react";
import BenchmarkList from "../BenchmarkList/BenchmarkList";
import PageSection from "../Page/PageSection";

type Props = ComponentProps<typeof BenchmarkList>;

export default function BenchmarkSection({ benchmarks }: Props) {
  return (
    <PageSection>
      <BenchmarkList benchmarks={benchmarks} />
    </PageSection>
  );
}
