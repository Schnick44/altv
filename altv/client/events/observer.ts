import * as alt from "alt-client";
import type {
  ClientEventObserver,
  IClientToInterface,
  IClientToServer,
  IInterfaceToClient,
  InterfaceToClientMiddleware,
  InterfaceToClientObserver,
  IServerToClient,
  ServerToClientMiddleware,
  ServerToClientObserver,
} from "schnick";
import { globalDependencies } from "../dependencies.js";
import { Browser } from "../lib/webview.js";

export const activeObservers: InterfaceToClientObserver &
  ServerToClientObserver &
  ClientEventObserver = {};

export function addClientEventListener<T extends keyof alt.IClientEvent>(
  name: T,
  callback: alt.IClientEvent[T],
) {
  if (!!activeObservers[name])
    return globalDependencies
      .Logger()
      .verbose(
        `Event listeners for client event "${name}" are called multiple times`,
      );

  activeObservers[name] = {
    createdAt: Date.now(),
    callback: callback as (...args: any[]) => any,
    type: "client",
  };

  alt.on(name, callback);
}

export function addServerEventListener<T extends keyof IServerToClient>(
  name: T,
  callback: ServerToClientMiddleware[T],
) {
  if (!!activeObservers[name])
    return globalDependencies
      .Logger()
      .verbose(
        `Event listeners for server event "${name}" are called multiple times`,
      );

  activeObservers[name] = {
    createdAt: Date.now(),
    callback,
    type: "server",
  };

  alt.onServer(name, callback);
}

export function addInterfaceEventListener<T extends keyof IInterfaceToClient>(
  name: T,
  callback: InterfaceToClientMiddleware[T],
) {
  if (!!activeObservers[name])
    return globalDependencies
      .Logger()
      .verbose(
        `Event listeners for interface event "${name}" are called multiple times`,
      );

  activeObservers[name] = {
    createdAt: Date.now(),
    callback: callback as (...args: any[]) => void,
    type: "interface",
  };

  Browser.on(name, callback);
}

export function removeEventListener<
  T extends keyof (IInterfaceToClient & IServerToClient & alt.IClientEvent),
>(name: T) {
  if (!activeObservers[name])
    return globalDependencies
      .Logger()
      .verbose(
        `Event listener for event "${name}" attempted to be removed while it does not exist`,
      );

  const event: Observable<any> = activeObservers[name]!;
  const args = [name, event.callback] as const;

  switch (event.type) {
    case "interface":
      Browser.off(...args);
      break;
    case "client":
      alt.off(...args);
      break;
    case "server":
      alt.offServer(...args);
      break;
  }

  delete activeObservers[name];
}

export function emitToServer<T extends keyof IClientToServer>(
  eventName: T,
  ...args: IClientToServer[T]
) {
  alt.emitServer(eventName, ...args);
}

export function emitToInterface<T extends keyof IClientToInterface>(
  eventName: T,
  ...args: IClientToInterface[T]
) {
  Browser.emit(eventName, ...args);
}
