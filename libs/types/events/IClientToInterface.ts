/// <reference path="./common.d.ts"/>

import type { Maybe } from "../util";

interface ISplashScreenEvents {
  GetInterfaceReady: [];
  SetClientReady: [splashSteps: number];
  SetSplashScreenStep: [
    data: { title: string; description: string },
    step: number,
  ];
}
interface ILoginEvents {
  OpenOAuthUrl: [url: string];
}
export interface IClientToInterface extends ISplashScreenEvents, ILoginEvents {
  Notification: [
    data: {
      head: string;
      description: string;
      type: "notification" | "info" | "warning";
      action: Maybe<"copy">;
    },
  ];
  KeydownX: [isKeydown: boolean];
}

export type ClientToInterfaceMiddleware = {
  [key in keyof IClientToInterface]: (...args: IClientToInterface[key]) => void;
};

export type ClientToInterfaceObserver = Partial<{
  [key in keyof IClientToInterface]: Observable<
    (...args: IClientToInterface[key]) => void
  >;
}>;
