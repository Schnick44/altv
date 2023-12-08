import { cached } from "./lib/cache.js";
import { Logger } from "./infrastructure/logger.js";
import { StartupHandler } from "./events/handler/StartupHandler.js";

export type GlobalDependencies = {
  Logger: Provider<Logger>;
};

export type RequestScopedDependencies = {
  StartupHandler: Provider<StartupHandler>;
};

export type Dependencies = GlobalDependencies & RequestScopedDependencies;

export const globalDependencies: GlobalDependencies = {
  Logger: cached(() => new Logger()),
};

export function buildDependencies(scopedContext: undefined) {
  const deps: Dependencies = {
    ...globalDependencies,

    StartupHandler: cached(() => new StartupHandler(deps)),
  };
  scopedContext;

  return deps;
}
