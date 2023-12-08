import controller from "./events/controller";
import { buildDependencies } from "./dependencies";
import "./express";

async function main() {
  const deps = buildDependencies(undefined);

  await deps.DiscordBot().connect();

  deps.ExpressAuthenticationServer();

  controller.add(deps.ConnectionHandler());
  controller.add(deps.AuthenticationHandler());

  controller.add(deps.JobHandler());
}

main();
