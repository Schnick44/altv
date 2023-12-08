import { Notice } from "../infrastructure/logger";
import { globalDependencies } from "../dependencies";

export enum ServerHandlerIdentifier {
  Authentication = "AuthenticationHandler",
  Connection = "ConnectionHandler",
  Job = "JobHandler",
}

class MainManager {
  handler: Record<string, IEventHandler> = {};

  constructor() {}

  async add(handler: IEventHandler) {
    if (this.handler[handler.identifier])
      throw new Notice(
        `Handler "${handler.identifier}" is already initialized`,
      );

    const identifier = handler.identifier as ServerHandlerIdentifier;

    this.handler[identifier] = handler;
    await handler.initialize();
    globalDependencies.Logger().verbose(`Handler "${identifier}" initialized`);

    return handler;
  }

  async stop() {
    Object.values(this.handler).forEach((h) => h.remove());
    globalDependencies.Logger().verbose("Removed all handlers");
    return true;
  }
}

let Manager = new MainManager();
export default Manager;
