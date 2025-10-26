import { ReactNode } from "react";

type Props = {
  onFocus: () => void;
  onClick: () => void;
  isFocused: boolean;
  isActive: boolean;
  children: ReactNode;
  icon: ReactNode;
};

const styles = {
  root: {
    default: {
      display: "flex",
      gap: "8px",
      alignItems: "center",
      border: "2px solid transparent",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "all 0.2s ease-in-out",
      paddingLeft: "8px",
      paddingRight: "8px",
    },
    focused: {
      border: "2px solid gray",
    },
    active: {
      textDecoration: "underline",
    },
  },
};

export default function PageNavigationControl({
  children,
  isFocused,
  isActive,
  onFocus,
  onClick,
  icon,
}: Props) {
  const style = {
    ...styles.root.default,
    ...(isFocused ? styles.root.focused : {}),
    ...(isActive ? styles.root.active : {}),
  };

  return (
    <li
      style={style}
      onFocus={onFocus}
      onClick={() => {
        console.log("Clicked");
        onClick();
      }}
      onMouseEnter={onFocus}
    >
      {icon}
      <h3>{children}</h3>
    </li>
  );
}
