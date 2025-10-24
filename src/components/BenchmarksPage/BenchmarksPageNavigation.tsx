import {
  CornerDownRight,
  MoveDown,
  MoveLeft,
  MoveRight,
  MoveUp,
} from "lucide-react";
import PageNavigation from "../Page/PageNavigation";
import PageNavigationList from "../Page/PageNavigationList";
import PageNavigationControl from "../Page/PageNavigationControl";

export type Control =
  | "categories"
  | "benchmarks"
  | "upload"
  | "moveUp"
  | "moveDown"
  | "moveBack"
  | "go";

type Props = {
  activeControl: Control | null;
  focusedControl: Control | null;
  onFocus: (control: Control) => void;
  onClick: (control: Control) => void;
};

export default function BenchmarksPageNavigation({
  activeControl,
  focusedControl,
  onFocus,
  onClick,
}: Props) {
  return (
    <PageNavigation>
      <PageNavigationList title="Navigation:">
        <PageNavigationControl
          onClick={() => onClick("categories")}
          isActive={activeControl === "categories"}
          isFocused={focusedControl === "categories"}
          onFocus={() => onFocus("categories")}
        >
          <h3>1. Categories</h3>
        </PageNavigationControl>
        <PageNavigationControl
          onClick={() => onClick("benchmarks")}
          isActive={activeControl === "benchmarks"}
          isFocused={focusedControl === "benchmarks"}
          onFocus={() => onFocus("benchmarks")}
        >
          <h3>2. Benchmarks</h3>
        </PageNavigationControl>
        <PageNavigationControl
          onClick={() => onClick("upload")}
          isActive={activeControl === "upload"}
          isFocused={focusedControl === "upload"}
          onFocus={() => onFocus("upload")}
        >
          <h3>3. Upload</h3>
        </PageNavigationControl>
      </PageNavigationList>
      <PageNavigationList title="Controls:">
        <PageNavigationControl
          onClick={() => onClick("moveBack")}
          isActive={activeControl === "moveBack"}
          isFocused={focusedControl === "moveBack"}
          onFocus={() => onFocus("moveBack")}
        >
          <MoveLeft size={16} />
          <h3>Move Back</h3>
        </PageNavigationControl>
        <PageNavigationControl
          onClick={() => onClick("go")}
          isActive={activeControl === "go"}
          isFocused={focusedControl === "go"}
          onFocus={() => onFocus("go")}
        >
          <MoveRight size={16} />
          <h3>|</h3>
          <CornerDownRight size={16} />
          <h3>Go</h3>
        </PageNavigationControl>
        <PageNavigationControl
          onClick={() => onClick("moveUp")}
          isActive={activeControl === "moveUp"}
          isFocused={focusedControl === "moveUp"}
          onFocus={() => onFocus("moveUp")}
        >
          <MoveUp size={16} />
          <h3>Move Up</h3>
        </PageNavigationControl>
        <PageNavigationControl
          onClick={() => onClick("moveDown")}
          isActive={activeControl === "moveDown"}
          isFocused={focusedControl === "moveDown"}
          onFocus={() => onFocus("moveDown")}
        >
          <MoveDown size={16} />
          <h3>Move Down</h3>
        </PageNavigationControl>
      </PageNavigationList>
    </PageNavigation>
  );
}
