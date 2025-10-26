import { ReactNode } from "react";

type NavigationControl<Control extends string> = {
  id: Control;
  label: string;
  icon: ReactNode;
};

export default NavigationControl;
