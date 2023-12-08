import { Color } from "../infrastructure/logger";
import type { Logger } from "../infrastructure/logger";

import Main from "../events/controller";

export class NodeProcessGuard {
  constructor(
    private deps: {
      Logger: Provider<Logger>;
    },
  ) {
    process.on("beforeExit", this.handleShutdown);
    process.on("exit", this.handleExit);
    process.on("uncaughtException", this.handleUncaughtException);
    process.on("unhandledRejection", this.handleUnhandledRejection);

    this.deps
      .Logger()
      .log(
        this.deps
          .Logger()
          .colorize("guardNodeProcess event listeners are running", Color.cyan),
      );
  }

  handleShutdown: NodeJS.BeforeExitListener = async (code) => {
    // ToDo
    await Main.stop();
    this.deps.Logger().log(`Shutdown! ${code}`);
  };

  handleExit: NodeJS.ExitListener = (code) => {
    this.deps
      .Logger()
      .log(
        `Exiting process with code ${this.deps
          .Logger()
          .colorize(code.toString(), Color.cyan)}`,
      );
  };

  handleUncaughtException: NodeJS.UncaughtExceptionListener = (error) => {
    this.deps.Logger().alert(`Uncaught Exception occured`);
    this.deps
      .Logger()
      .trace(error)
      .then(() => process.exit(550));
  };

  handleUnhandledRejection: NodeJS.UnhandledRejectionListener = (
    reason,
    promise,
  ) => {
    this.deps.Logger().alert(`Unhandled rejection for promise`);
    console.log(promise);
    this.deps.Logger().alert(`Reason: ${reason ?? "undefined"}`);
  };
}
