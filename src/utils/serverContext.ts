import { BenchmarksService } from "@/types/BenchmarksService";
import BuildManifest from "@/types/BundleManifest";
import { SQL } from "bun";
import { proxy } from "valtio/vanilla";

type ServerContext = {
  buildManifest: BuildManifest | null;
  server: Bun.Serve.Options<any> | null;
  serviceInstances: {
    benchmarksServiceInstance: BenchmarksService;
  } | null;
  sqlClient: SQL | null;
};

const serverContext: ServerContext = proxy({
  buildManifest: null,
  server: null,
  serviceInstances: null,
  sqlClient: null,
});

export function initServerContext(context: Omit<ServerContext, "server">) {
  serverContext.buildManifest = context.buildManifest;
  serverContext.serviceInstances = context.serviceInstances;
  serverContext.sqlClient = context.sqlClient;
}

export function setServerContextRoutes(server: Bun.Serve.Options<any>) {
  serverContext.server = server;
}

export default serverContext;
