import * as alt from "alt-server";
import type {
  ClientToServerMiddleware,
  ClientToServerObserver,
  IServerToClient,
  ServerEventObserver,
} from "schnick";
import { Notice } from "../infrastructure/logger";

export const activeObservers: ClientToServerObserver & ServerEventObserver = {};

export function addClientEventListener<
  T extends keyof ClientToServerMiddleware,
>(name: T, callback: ClientToServerMiddleware[T]) {
  if (!!activeObservers[name])
    throw new Notice(
      `Event listeners for client event "${name}" are called multiple times`,
    );

  activeObservers[name] = {
    createdAt: Date.now(),
    callback: callback as (...args: any[]) => void,
    type: "client",
  };

  alt.onClient(name, callback);
}

export function addServerEventListener<T extends keyof alt.IServerEvent>(
  name: T,
  callback: alt.IServerEvent[T],
) {
  if (!!activeObservers[name])
    throw new Notice(
      `Event listeners for server event "${name}" are called multiple times`,
    );

  activeObservers[name] = {
    createdAt: Date.now(),
    callback: callback as (...args: any[]) => void,
    type: "server",
  };

  alt.on(name, callback);
}

export function removeEventListener<
  T extends keyof (ClientToServerMiddleware & alt.IServerEvent),
>(name: T) {
  if (!activeObservers[name])
    throw new Notice(
      `Event listener for event "${name}" attempted to be removed while it does not exist`,
    );

  const event = activeObservers[name] as Observable<(...args: any) => void>;
  const off = event.type === "client" ? alt.offClient : alt.off;

  delete activeObservers[name];
  off(name, event.callback);
}

export function emitToClient<T extends keyof IServerToClient>(
  target: alt.Player,
  eventName: T,
  ...args: IServerToClient[T]
) {
  alt.emitClient(target, eventName, ...args);
}

export function emitToAllClients<T extends keyof IServerToClient>(
  eventName: T,
  ...args: IServerToClient[T]
) {
  alt.emitAllClients(eventName, ...args);
}
