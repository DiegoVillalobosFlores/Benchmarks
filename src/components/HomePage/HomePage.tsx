import Page from "../Page";
import "./HomePage.css";

type Props = {
  assetLinks: string[];
};

export default function HomePage({ assetLinks }: Props) {
  return (
    <Page.Shell assetLinks={assetLinks} title="Benchmarks">
      <Page.Header title="Welcome to Benchmarks" />
      <Page.Main>
        <Page.Section>
          <h1 className={"test"}>Welcome to Benchmarks</h1>
        </Page.Section>
      </Page.Main>
    </Page.Shell>
  );
}
