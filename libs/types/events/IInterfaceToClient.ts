/// <reference path="./common.d.ts"/>

export interface IInterfaceToClient {
  SetInterfaceReady: [];
}

export type InterfaceToClientMiddleware = {
  [key in keyof IInterfaceToClient]: (...args: IInterfaceToClient[key]) => void;
};
export type InterfaceToClientObserver = Partial<{
  [key in keyof IInterfaceToClient]: Observable<
    (...args: IInterfaceToClient[key]) => void
  >;
}>;
