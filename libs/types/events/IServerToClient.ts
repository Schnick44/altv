/// <reference path="./common.d.ts"/>

export interface IServerToClient {
  SetServerReady: [authUrl: string];
  DiscordLoginSuccess: [];
  DiscordLoginReject: [];
}

export type ServerToClientMiddleware = {
  [key in keyof IServerToClient]: (...args: IServerToClient[key]) => void;
};
export type ServerToClientObserver = Partial<{
  [key in keyof IServerToClient]: Observable<
    (...args: IServerToClient[key]) => void
  >;
}>;
