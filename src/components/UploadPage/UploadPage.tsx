import AppAssetMap from "@/types/AppAssetMap";
import FileUpload from "../FileUpload/FileUpload";
import Page from "../Page";
import UploadPageNavigation from "./UploadPageNavigation";
import { ComponentProps, useEffect, useState } from "react";
import useKeyboardNavigation from "@/utils/useKeyboardNavigation";

type Props = {
  assetMap: AppAssetMap;
};

type Control = ComponentProps<typeof UploadPageNavigation>["activeControl"];

export default function UploadPage({ assetMap }: Props) {
  const [focusedControl, setFocusedControl] = useState<Control | null>(null);
  const [activeControl, setActiveControl] = useState<Control | null>("upload");
  const [clearControls, setClearControls] = useState<boolean>(false);

  useEffect(() => {
    if (!clearControls) return;

    const timeoutId = setTimeout(() => {
      setFocusedControl(null);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [focusedControl, clearControls]);

  useKeyboardNavigation({
    ArrowLeft: () => {
      setFocusedControl("moveBack");
      setClearControls(true);
      window.history.back();
    },
    1: () => {
      setFocusedControl("categories");
      setClearControls(true);
    },
    2: () => {
      setFocusedControl("benchmarks");
      setClearControls(true);
      window.location.href = "/";
    },
    3: () => {
      setFocusedControl("upload");
      setActiveControl("upload");
      setClearControls(true);
    },
  });

  return (
    <Page.Shell assetMap={assetMap} title="Benchmarks - Upload">
      <Page.Header title="New Benchmark" />
      <Page.Section>
        <FileUpload onUploadSuccess={() => (window.location.href = "/")} />
      </Page.Section>
      <UploadPageNavigation
        onClick={(control) => {
          if (control === "upload") {
            setActiveControl("upload");
          }
          if (control === "categories") {
            setActiveControl("categories");
          }
          if (control === "benchmarks") {
            setActiveControl("benchmarks");
            window.location.assign("/");
          }
        }}
        activeControl={activeControl}
        focusedControl={focusedControl}
        onFocus={(control) => {
          setFocusedControl(control);
          setClearControls(false);
        }}
      />
    </Page.Shell>
  );
}
