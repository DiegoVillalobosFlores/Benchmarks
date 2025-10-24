import { MoveLeft } from "lucide-react";
import PageNavigation from "../Page/PageNavigation";
import PageNavigationControl from "../Page/PageNavigationControl";
import PageNavigationList from "../Page/PageNavigationList";

type Control = "categories" | "benchmarks" | "upload" | "moveBack";

type Props = {
  activeControl: Control | null;
  focusedControl: Control | null;
  onFocus: (control: Control) => void;
};

export default function UploadPageNavigation({
  activeControl,
  focusedControl,
  onFocus,
}: Props) {
  return (
    <PageNavigation>
      <PageNavigationList title="Navigation:">
        <PageNavigationControl
          isActive={activeControl === "categories"}
          isFocused={focusedControl === "categories"}
          onFocus={() => onFocus("categories")}
        >
          <h3>1. Categories</h3>
        </PageNavigationControl>
        <PageNavigationControl
          isActive={activeControl === "benchmarks"}
          isFocused={focusedControl === "benchmarks"}
          onFocus={() => onFocus("benchmarks")}
        >
          <h3>2. Benchmarks</h3>
        </PageNavigationControl>
        <PageNavigationControl
          isActive={activeControl === "upload"}
          isFocused={focusedControl === "upload"}
          onFocus={() => onFocus("upload")}
        >
          <h3>3. Upload</h3>
        </PageNavigationControl>
      </PageNavigationList>
      <PageNavigationList title="Controls:">
        <PageNavigationControl
          isActive={activeControl === "moveBack"}
          isFocused={focusedControl === "moveBack"}
          onFocus={() => onFocus("moveBack")}
        >
          <MoveLeft size={16} />
          <h3>Move Back</h3>
        </PageNavigationControl>
      </PageNavigationList>
    </PageNavigation>
  );
}
