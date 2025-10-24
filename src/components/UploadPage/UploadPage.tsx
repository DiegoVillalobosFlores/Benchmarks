import AppAssetMap from "@/types/AppAssetMap";
import FileUpload from "../FileUpload/FileUpload";
import Page from "../Page/Page";
import UploadPageNavigation from "./UploadPageNavigation";
import { ComponentProps, useEffect, useState } from "react";
import PageSection from "../Page/PageSection";
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
    ArrowUp: () => {
      // setFocusedControl("moveUp");
      setClearControls(true);
    },
    ArrowDown: () => {
      // setFocusedControl("moveDown");
      setClearControls(true);
    },
    ArrowLeft: () => {
      setFocusedControl("moveBack");
      setClearControls(true);
      window.history.back();
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
      window.location.href = "/";
    },
    3: () => {
      setFocusedControl("upload");
      setActiveControl("upload");
      setClearControls(true);
    },
  });

  return (
    <Page
      assetMap={assetMap}
      title="Benchmarks - Upload"
      header={<h1>Upload a new benchmark</h1>}
      navigation={
        <UploadPageNavigation
          activeControl={activeControl}
          focusedControl={focusedControl}
          onFocus={(control) => {
            setFocusedControl(control);
            setClearControls(false);
          }}
        />
      }
    >
      <PageSection>
        <FileUpload onUploadSuccess={() => (window.location.href = "/")} />
      </PageSection>
    </Page>
  );
}
