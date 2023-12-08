import fs from "fs";
import path from "path";
import { environment } from "./environment";
import { getDate, getTime } from "../lib/time";

export enum Color {
  red = "\x1b[31m",
  green = "\x1b[32m",
  yellow = "\x1b[33m",
  blue = "\x1b[34m",
  magenta = "\x1b[35m",
  cyan = "\x1b[36m",
  white = "\x1b[37m",
}

export class Notice extends Error {
  constructor(message: string) {
    super(message);
    alert(message);
  }
}

export class Logger {
  constructor() {}

  /** Colorizes the input message with the given color enum */
  colorize(message: string, color: Color) {
    return `${color}${message}${Color.white}`;
  }

  /** Logs to `stdout` with a current timestamp */
  log(message: string) {
    console.log(`[${getTime()}] ${message}`);
  }

  /** Logs to `stdout` if verbose mode is set in .env */
  verbose(message: string) {
    if (!environment.ENABLE_VERBOSE) return;
    this.log(`[${this.colorize("V", Color.cyan)}] ${message}`);
  }

  /** Logs to `stdout` in red color */
  alert(message: string) {
    this.log(this.colorize(message, Color.red));
  }

  /** Logs an error onto a logging file */
  async trace(error: Error = new Error()) {
    await fs.promises
      .appendFile(
        path.join(__dirname, "../../../../error.log"),
        `${getDate()} ${error.stack || error}\n`,
      )
      .then(() => {
        this.log(this.colorize("Stack appended to error.log", Color.red));
      });
    return 600;
  }

  activeTimeLogs: Record<string, number> = {};
  setLogTimeMs(key: string) {
    this.activeTimeLogs[key] = new Date().getTime();
    return undefined;
  }

  getLogTimeMs(key: string) {
    if (!this.activeTimeLogs[key]) return -1;
    const time = new Date().getTime() - this.activeTimeLogs[key];
    delete this.activeTimeLogs[key];
    return time;
  }
}
