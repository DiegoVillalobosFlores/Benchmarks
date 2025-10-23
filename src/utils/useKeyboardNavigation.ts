import { useEffect, useState } from "react";

export default function useKeyboardNavigation(
  initialIndex: number | null,
  maxRange: number,
) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(
    initialIndex,
  );

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.key === "ArrowUp") {
        setSelectedIndex((index) =>
          index !== null ? (index === 0 ? maxRange : index - 1) : maxRange,
        );
      }

      if (event.key === "ArrowDown") {
        setSelectedIndex((index) =>
          index !== null ? (index === maxRange ? 0 : index + 1) : 0,
        );
      }
    };
    window.addEventListener("keydown", listener);
    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, [maxRange]);

  return {
    selectedIndex,
    setSelectedIndex,
  };
}
