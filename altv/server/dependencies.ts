import { cached } from "./lib/cache";
import { Logger } from "./infrastructure/logger";
import { DiscordClient } from "./discord";
import { AuthenticationHandler } from "./events/handler/AuthenticationHandler";
import { ConnectionHandler } from "./events/handler/ConnectionHandler";
import { JobHandler } from "./events/handler/JobHandler";
import { NodeProcessGuard } from "./lib/guard";
import { ExpressAuthenticationServer } from "./express";

export type GlobalDependencies = {
  Logger: Provider<Logger>;
};

export type RequestScopedDependencies = {
  NodeProcessGuard: Provider<NodeProcessGuard>;

  DiscordBot: Provider<DiscordClient>;

  AuthenticationHandler: Provider<AuthenticationHandler>;
  ConnectionHandler: Provider<ConnectionHandler>;
  JobHandler: Provider<JobHandler>;

  ExpressAuthenticationServer: Provider<ExpressAuthenticationServer>;
};

export type Dependencies = GlobalDependencies & RequestScopedDependencies;

export const globalDependencies: GlobalDependencies = {
  Logger: cached(() => new Logger()),
};

export function buildDependencies(scopedContext: undefined) {
  const deps: Dependencies = {
    ...globalDependencies,

    NodeProcessGuard: cached(() => new NodeProcessGuard(deps)),

    DiscordBot: cached(() => new DiscordClient(deps)),

    AuthenticationHandler: cached(() => new AuthenticationHandler(deps)),
    ConnectionHandler: cached(() => new ConnectionHandler()),
    JobHandler: cached(() => new JobHandler(deps)),

    ExpressAuthenticationServer: cached(
      () => new ExpressAuthenticationServer(deps),
    ),
  };
  scopedContext;

  return deps;
}
