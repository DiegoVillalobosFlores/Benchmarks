import { MoveLeft } from "lucide-react";
import PageNavigation from "../Page/PageNavigation";
import PageNavigationControl from "../Page/PageNavigationControl";
import PageNavigationList from "../Page/PageNavigationList";
import NavigationControl from "@/types/NavigationControl";

type Control = "categories" | "benchmarks" | "upload" | "moveBack";

type Props = {
  activeControl: Control | null;
  focusedControl: Control | null;
  onFocus: (control: Control) => void;
  onClick: (control: Control) => void;
};

const navigationControls: NavigationControl<Control>[] = [
  {
    id: "categories",
    label: "Categories",
    icon: <>1</>,
  },
  {
    id: "benchmarks",
    label: "Benchmarks",
    icon: <>2</>,
  },
  {
    id: "upload",
    label: "Upload",
    icon: <>3</>,
  },
];

const selectionControls: NavigationControl<Control>[] = [
  {
    id: "moveBack",
    label: "Go Back",
    icon: <MoveLeft />,
  },
];

export default function UploadPageNavigation({
  activeControl,
  focusedControl,
  onFocus,
  onClick,
}: Props) {
  return (
    <PageNavigation>
      <PageNavigationList title="Navigation:">
        {navigationControls.map((control) => (
          <PageNavigationControl
            key={control.id}
            onClick={() => onClick(control.id)}
            isActive={activeControl === control.id}
            isFocused={focusedControl === control.id}
            onFocus={() => onFocus(control.id)}
            icon={control.icon}
          >
            {control.label}
          </PageNavigationControl>
        ))}
      </PageNavigationList>
      <PageNavigationList title="Selection:">
        {selectionControls.map((control) => (
          <PageNavigationControl
            key={control.id}
            onClick={() => onClick(control.id)}
            isActive={activeControl === control.id}
            isFocused={focusedControl === control.id}
            onFocus={() => onFocus(control.id)}
            icon={control.icon}
          >
            {control.label}
          </PageNavigationControl>
        ))}
      </PageNavigationList>
    </PageNavigation>
  );
}
