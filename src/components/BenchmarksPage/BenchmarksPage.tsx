import BenchmarkList from "@/components/BenchmarkList/BenchmarkList";
import BenchmarksPageNavigation, {
  Control,
} from "@/components/BenchmarksPage/BenchmarksPageNavigation";
import Page from "@/components/Page/Page";
import PageSection from "@/components/Page/PageSection";
import AppAssetMap from "@/types/AppAssetMap";
import useKeyboardNavigation from "@/utils/useKeyboardNavigation";
import { ComponentProps, useEffect, useState } from "react";

type Props = {
  assetMap: AppAssetMap;
  benchmarks: ComponentProps<typeof BenchmarkList>["benchmarks"];
};

export default function BenchmarksPage({ assetMap, benchmarks }: Props) {
  const [selectedBenchmarkIndex, setSelectedBenchmarkIndex] = useState<
    number | null
  >(null);
  const [focusedControl, setFocusedControl] = useState<Control | null>(null);
  const [activeControl, setActiveControl] = useState<Control | null>(
    "benchmarks",
  );
  const [clearControls, setClearControls] = useState<boolean>(false);

  useEffect(() => {
    if (!clearControls) return;

    const timeoutId = setTimeout(() => {
      setFocusedControl(null);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [focusedControl, clearControls]);

  const maxRange = benchmarks.length - 1;

  useKeyboardNavigation({
    ArrowUp: () => {
      setSelectedBenchmarkIndex((index) =>
        index !== null ? (index === 0 ? maxRange : index - 1) : maxRange,
      );
      setFocusedControl("moveUp");
      setClearControls(true);
    },
    ArrowDown: () => {
      setSelectedBenchmarkIndex((index) =>
        index !== null ? (index === maxRange ? 0 : index + 1) : 0,
      );
      setFocusedControl("moveDown");
      setClearControls(true);
    },
    ArrowLeft: () => {
      setFocusedControl("moveBack");
      setClearControls(true);
    },
    ArrowRight: () => {
      setFocusedControl("go");
      setClearControls(true);
    },
    Enter: () => {
      setFocusedControl("go");
      setClearControls(true);
    },
    1: () => {
      setFocusedControl("categories");
      setClearControls(true);
    },
    2: () => {
      setFocusedControl("benchmarks");
      setClearControls(true);
    },
    3: () => {
      setActiveControl("upload");
      setFocusedControl("upload");
      setClearControls(false);
      window.location.assign("/upload");
    },
  });

  return (
    <Page
      assetMap={assetMap}
      title="Benchmarks"
      header={<h1>Welcome to Benchmarks</h1>}
      navigation={
        <BenchmarksPageNavigation
          activeControl={activeControl}
          focusedControl={focusedControl}
          onClick={(control) => {
            setClearControls(false);

            if (control === "upload") {
              setActiveControl("upload");
              setFocusedControl("upload");
              window.location.href = "/upload";
            }

            if (control === "categories") {
              setActiveControl("categories");
              setFocusedControl("categories");
            }

            if (control === "benchmarks") {
              setActiveControl("benchmarks");
              setFocusedControl("benchmarks");
            }
          }}
          onFocus={(control) => {
            setFocusedControl(control);
            setClearControls(false);
          }}
        />
      }
    >
      <PageSection>
        <BenchmarkList
          benchmarks={benchmarks}
          selectedBenchmarkIndex={selectedBenchmarkIndex}
          onBenchmarkFocus={setSelectedBenchmarkIndex}
        />
      </PageSection>
    </Page>
  );
}
