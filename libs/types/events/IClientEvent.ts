/// <reference path="./common.d.ts"/>

export type IClientEvent = {};

export type ClientEventObserver = Partial<
  {
    [key in keyof IClientEvent]: Observable<
      (...args: IClientEvent[key]) => void
    >;
  } & {
    [key in keyof altIClientEvent]: Observable<altIClientEvent[key]>;
  }
>;
