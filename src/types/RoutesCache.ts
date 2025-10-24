import { BunFile } from "bun";

type RoutesCache = {
  root: {
    url: string;
    hit: boolean;
    file: BunFile;
  };
  upload: {
    url: string;
    hit: boolean;
    file: BunFile;
  };
};

export default RoutesCache;
