import { useEffect, useState } from "react";

type Props = Record<string, () => void>;

export default function useKeyboardNavigation(controls: Props) {
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      const control = controls[event.key];

      if (control) {
        event.preventDefault();
        control();
      }
    };

    window.addEventListener("keydown", listener);

    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, []);
}
