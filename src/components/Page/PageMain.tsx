type Props = {
  children: React.ReactNode;
};

export default function PageMain({ children }: Props) {
  return <main>{children}</main>;
}
