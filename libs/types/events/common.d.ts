/// <reference types="@altv/types-server"/>
/// <reference types="@altv/types-client"/>

declare type ServerPlayer = import("alt-server").Player;
declare type altIServerEvent = import("alt-server").IServerEvent;
declare type altIClientEvent = import("alt-client").IClientEvent;

declare type Observable<CallbackType extends Function> = {
  createdAt: number;
  callback: CallbackType;
  type: "server" | "client" | "interface";
};

declare interface IEventHandler {
  identifier: string;
  initialize(): Promise<void>;
  remove(): void;
}

declare type Provider<T> = () => T;
