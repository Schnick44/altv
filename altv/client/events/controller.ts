import { Notice } from "../infrastructure/logger.js";
import { globalDependencies } from "../dependencies.js";

class MainManager {
  handler: Record<string, IEventHandler> = {};

  constructor() {}

  async add(handler: IEventHandler) {
    if (this.handler[handler.identifier])
      throw new Notice(
        `Handler "${handler.identifier}" is already initialized`,
      );

    this.handler[handler.identifier] = handler;
    await handler.initialize();
    globalDependencies
      .Logger()
      .verbose(`Handler "${handler.identifier}" initialized`);

    return handler;
  }

  removeHandler(indentifier: IEventHandler["identifier"]) {
    this.handler[indentifier]?.remove();
  }

  async stop() {
    Object.values(this.handler).forEach((h) => h.remove());
    globalDependencies.Logger().verbose("Removed all handlers");
    return true;
  }
}

let Manager = new MainManager();
export default Manager;
