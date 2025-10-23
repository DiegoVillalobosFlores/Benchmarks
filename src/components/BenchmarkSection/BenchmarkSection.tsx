import { ComponentProps } from "react";
import BenchmarkList from "../BenchmarkList/BenchmarkList";
import FileUpload from "../FileUpload/FileUpload";

type Props = ComponentProps<typeof BenchmarkList>;

export default function BenchmarkSection({ benchmarks }: Props) {
  return (
    <section>
      <BenchmarkList benchmarks={benchmarks} />
    </section>
  );
}
