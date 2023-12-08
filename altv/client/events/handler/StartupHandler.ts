import { requestModel } from "natives";
import { hash } from "alt-client";
import {
  addInterfaceEventListener,
  addServerEventListener,
  emitToInterface,
  emitToServer,
  removeEventListener,
} from "../observer.js";
import type { Dependencies } from "../../dependencies.js";
import { setGameControls } from "../../lib/controls.js";
import { retryOnTimeout } from "../../util.js";
import type { Maybe } from "schnick";

/**
 * Run once on client Startup, destroy after run completion
 */
export class StartupHandler implements IEventHandler {
  identifier = "StartupHandler";
  nonce: Maybe<string>;
  workflow = [] as {
    method: () => any;
    interfaceData: { title: string; description: string };
  }[];
  loginUrl: Maybe<string>;

  constructor(private deps: Dependencies) {
    this.workflow = [
      {
        method: this.getInterfaceReadiness,
        interfaceData: {
          title: "Lade...",
          description: "...",
        },
      },
      {
        method: this.getServerReadiness,
        interfaceData: {
          title: "Lade...",
          description: "Warte auf Rückmeldung des Servers",
        },
      },
      {
        method: this.openAuthUrl,
        interfaceData: {
          title: "Login",
          description: "Erwarte Discord-Login über Browserfenster",
        },
      },
    ];
  }

  async initialize() {
    this.run();
  }

  remove() {
    removeEventListener("SetInterfaceReady");
  }

  private setSplashScreenStep = (
    interfaceData: { title: string; description: string },
    step: number,
  ) => {
    emitToInterface("SetSplashScreenStep", interfaceData, step);
  };

  private run = async () => {
    setGameControls(false);
    this.requestModels();

    for (let [index, workflowEntry] of this.workflow.entries()) {
      this.setSplashScreenStep(workflowEntry.interfaceData, index);
      try {
        await workflowEntry.method();
      } catch (e) {
        this.deps.Logger().alert("Fehler beim Starten des Clients");
      }
    }
  };

  private requestModels() {
    requestModel(hash("mp_f_freemode_01"));
    requestModel(hash("mp_m_freemode_01"));
  }

  private getInterfaceReadiness = () => {
    return new Promise((resolve, reject) => {
      function onInterfaceReady() {
        request.resolve();

        resolve(undefined);
      }

      addInterfaceEventListener("SetInterfaceReady", onInterfaceReady);

      const request = retryOnTimeout(
        () => emitToInterface("GetInterfaceReady"),
        5000,
        4,
        reject,
      );
    });
  };

  private getServerReadiness = () => {
    return new Promise((resolve, reject) => {
      const onServerReady = (authUrl: string) => {
        request.resolve();

        this.loginUrl = authUrl;
        resolve(true);
      };

      addServerEventListener("SetServerReady", onServerReady);

      const request = retryOnTimeout(
        () => emitToServer("GetServerReady"),
        5000,
        4,
        reject,
      );
    });
  };

  private openAuthUrl = () => {
    return new Promise((resolve, reject) => {
      const onDiscordLoginSuccess = () => {
        resolve(true);
      };

      const onDiscordLoginReject = () => {
        reject(false);
      };

      const url = this.loginUrl;
      if (!url) return reject();

      emitToInterface("OpenOAuthUrl", url);

      addServerEventListener("DiscordLoginSuccess", onDiscordLoginSuccess);
      addServerEventListener("DiscordLoginReject", onDiscordLoginReject);
    });
  };
}
