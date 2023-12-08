import { log } from "alt-client";
import { emitToInterface } from "../events/observer.js";

export class Notice extends Error {
  constructor(message: string) {
    super(message);
    alert(message);
  }
}

export class Logger {
  constructor() {}

  /** Logs to `stdout` with a current timestamp */
  log(message: string) {
    log(`${message}`);
  }

  // ToDo
  /** Logs to `stdout` and pushes to interface */
  alert(message: string) {
    this.log(message);
    emitToInterface("Notification", {
      type: "warning",
      head: "Warnung",
      description: message,
      action: undefined,
    });
  }

  verbose(message: string) {
    this.log(message);
  }

  /** Pushes a notification to the interface */
  notify() {}
}
