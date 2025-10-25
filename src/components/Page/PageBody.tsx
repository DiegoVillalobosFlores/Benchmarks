type Props = {
  children: React.ReactNode;
};

export default function PageBody({ children }: Props) {
  return <body>{children}</body>;
}
