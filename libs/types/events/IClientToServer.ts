/// <reference path="./common.d.ts"/>

export interface IClientToServer {
  GetServerReady: [];
}

// Decorates all IClientToServer requests with the alt.Player argument
type Decorator<T extends (...args: any) => any> = {
  (player: ServerPlayer, ...args: Parameters<T>): ReturnType<T>;
};
export type ClientToServerMiddleware = {
  [key in keyof IClientToServer]: Decorator<
    (...args: IClientToServer[key]) => void
  >;
};

export type ClientToServerObserver = Partial<{
  [key in keyof ClientToServerMiddleware]: Observable<
    ClientToServerMiddleware[key]
  >;
}>;
