type BuildManifest = Record<
  string,
  {
    scripts: string[];
    assets: string[];
  }
>;

export default BuildManifest;
