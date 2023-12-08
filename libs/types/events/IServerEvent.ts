/// <reference path="./common.d.ts"/>

export interface IServerEvent {}

export type ServerEventObserver = Partial<
  {
    [key in keyof IServerEvent]: Observable<IServerEvent[key]>;
  } & {
    [key in keyof altIServerEvent]: Observable<altIServerEvent[key]>;
  }
>;
