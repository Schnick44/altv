/// <reference types="@altv/types-webview"/>
import type {
  ClientToInterfaceMiddleware,
  ClientToInterfaceObserver,
  IClientToInterface,
  IInterfaceToClient,
} from "schnick";

export default class EventObserver {
  activeObservers: ClientToInterfaceObserver = {};

  add<T extends keyof IClientToInterface>(
    name: T,
    callback: ClientToInterfaceMiddleware[T],
  ) {
    if (!!this.activeObservers[name])
      throw new Error(
        `Event listeners for client event "${name}" are called multiple times`,
      );

    this.activeObservers[name] = {
      createdAt: Date.now(),
      callback: callback as (...args: any[]) => void,
      type: "client",
    };

    if ("alt" in window) alt.on(name, callback);
  }

  remove<T extends keyof IClientToInterface>(name: T) {
    if (!this.activeObservers[name])
      throw new Error(
        `Event listener for event "${name}" attempted to be removed while it does not exist`,
      );

    const event = this.activeObservers[name] as Observable<
      (...args: any) => void
    >;

    delete this.activeObservers[name];

    if ("alt" in window) alt.off(name, event.callback);
  }

  emit<T extends keyof IInterfaceToClient>(
    eventName: T,
    ...args: IInterfaceToClient[T]
  ) {
    if ("alt" in window) alt.emit(eventName, ...args);
  }
}
