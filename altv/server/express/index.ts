import * as alt from "alt-server";
import express from "express";
import cors from "cors";
import path from "path";
import axios from "axios";
import type { Request, Response } from "express";
import { environment } from "../infrastructure/environment";
import type { AuthenticationHandler } from "../events/handler/AuthenticationHandler";
import type { Logger } from "../infrastructure/logger";
import type { DiscordUserData } from "schnick/server";

export class ExpressAuthenticationServer {
  resourcePath = alt.Resource.current.path;
  url = {
    html: path.join(this.resourcePath, "server/express/html"),
    js: path.join(this.resourcePath, "server/express/js"),
    styles: path.join(this.resourcePath, "server/express/styles"),
  };

  app = express();

  constructor(
    private deps: {
      AuthenticationHandler: Provider<AuthenticationHandler>;
      Logger: Provider<Logger>;
    },
  ) {
    this.app.use(cors());

    this.app.use("/js", express.static(this.url.js));
    this.app.use("/styles", express.static(this.url.styles));

    this.app.get("/auth", this.useAuth);

    this.app.listen(environment.DISCORD_REDIRECT_PORT);

    this.deps.Logger().verbose("Express Server running");
  }

  useAuth = async (req: Request, res: Response) => {
    const token = req.query.code;
    const userToken = req.query.state;

    if (!token || !userToken) {
      res.sendFile(path.join(this.url.html, "/error.html"));
      return;
    }

    const authParams = new URLSearchParams();
    authParams.append("client_id", environment.DISCORD_CLIENT_ID);
    authParams.append("client_secret", environment.DISCORD_CLIENT_SECRET);
    authParams.append("grant_type", "authorization_code");
    authParams.append("code", token.toString());
    authParams.append("scope", "identify");
    authParams.append(
      "redirect_uri",
      `http://${environment.DISCORD_REDIRECT_IP}:${environment.DISCORD_REDIRECT_PORT}/auth`,
    );

    // Get Authorization to request Discord user data
    const tokenRequest = await axios
      .post("https://discordapp.com/api/oauth2/token", authParams, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      })
      .catch((e) => {
        this.deps.Logger().alert("Axios Error during express auth");
        this.deps.Logger().trace(e);
      });

    if (!tokenRequest?.data?.token_type || !tokenRequest.data.access_token) {
      res.sendFile(path.join(this.url.html, "/error.html"));
      return;
    }

    // Get Discord user data
    const userRequest = await axios
      .get("https://discordapp.com/api/users/@me", {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `${tokenRequest.data.token_type} ${tokenRequest.data.access_token}`,
        },
      })
      .catch((e) => {
        this.deps.Logger().alert("Axios Error during access token validation");
        this.deps.Logger().trace(e);
      });

    if (!userRequest?.data?.id || !userRequest.data.username) {
      res.sendFile(path.join(this.url.html, "/error.html"));
      return;
    }

    // Compare generated nonce
    const player = [...alt.Player.all].find(
      (player) => player.token === userToken,
    );
    if (!player || !player.valid) {
      res.sendFile(path.join(this.url.html, "/error.html"));
      return;
    }

    // Check if user is Whitelisted
    if (this.deps.AuthenticationHandler().isWhitelistEnabled) {
      const isAuthorized = this.deps
        .AuthenticationHandler()
        .isWhitelisted(userRequest.data.id);
      if (!isAuthorized) {
        res.sendFile(path.join(this.url.html, "/whitelist.html"));
        return;
      }
    }

    const userData = userRequest.data as DiscordUserData;

    this.deps.AuthenticationHandler().initiateLogin(player, userData);
    res.sendFile(path.join(this.url.html, "/done.html"));
  };
}
