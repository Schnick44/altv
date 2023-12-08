import { ServerHandlerIdentifier } from "../controller";
import type { AuthenticationHandler } from "./AuthenticationHandler";

export class JobHandler implements IEventHandler {
  identifier = ServerHandlerIdentifier.Job;

  interval: Record<string, NodeJS.Timer> = {};

  constructor(
    private deps: {
      AuthenticationHandler: Provider<AuthenticationHandler>;
    },
  ) {}

  initialize = async () => {
    this.interval = {
      refreshWhitelist: setInterval(
        this.deps.AuthenticationHandler().refreshWhitelist,
        60e4,
      ),
    };

    this.deps.AuthenticationHandler().refreshWhitelist();
  };

  remove = () => {
    Object.values(this.interval).forEach(clearInterval);
  };
}
