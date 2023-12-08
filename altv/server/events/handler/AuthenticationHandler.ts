import {
  addClientEventListener,
  emitToClient,
  removeEventListener,
} from "../observer";
import * as alt from "alt-server";
import crypto from "crypto";
import sjcl from "sjcl";
import { environment } from "../../infrastructure/environment";
import type { Logger } from "../../infrastructure/logger";
import type { DiscordClient } from "../../discord";
import { ServerHandlerIdentifier } from "../controller";
import type { DiscordUserData } from "schnick/server";
import type { UserRepository } from "../../domain/user/UserRepository";
export class AuthenticationHandler implements IEventHandler {
  identifier = ServerHandlerIdentifier.Authentication;

  redirectURI = encodeURI(
    `http://${environment.DISCORD_REDIRECT_IP}:${environment.DISCORD_REDIRECT_PORT}/auth`,
  );
  oAuthURI = `https://discord.com/api/oauth2/authorize?client_id=${environment.DISCORD_CLIENT_ID}&redirect_uri=${this.redirectURI}&prompt=none&response_type=code&scope=identify`;

  whitelist: string[] = [];

  constructor(
    private deps: {
      Logger: Provider<Logger>;
      DiscordBot: Provider<DiscordClient>;
    },
  ) {}

  async initialize() {
    addClientEventListener("GetServerReady", this.getServerReadiness);
  }

  remove() {
    removeEventListener("GetServerReady");
  }

  getServerReadiness = (player: alt.Player) => {
    if (!player.valid) return;

    if (!player.token) player.token = this.generateNonce(player.ip);
    emitToClient(
      player,
      "SetServerReady",
      `${this.oAuthURI}&state=${player.token}`,
    );
  };

  generateNonce = (unique: string) => {
    const hashBytes = sjcl.hash.sha256.hash(
      unique + crypto.randomBytes(8).toString(),
    );

    const nonce = sjcl.codec.hex.fromBits(hashBytes);
    return nonce;
  };

  get isWhitelistEnabled() {
    return environment.ENABLE_WHITELIST;
  }

  isWhitelisted = (id: string) => {
    return this.whitelist.includes(id);
  };

  refreshWhitelist = () => {
    this.deps.Logger().verbose("Refreshing whitelist...");
    this.deps.Logger().setLogTimeMs("refreshWhitelist");

    this.deps
      .DiscordBot()
      .cache.Guild()
      .members.fetch()
      .then(() => {
        const whitelistedMemberCollection = this.deps
          .DiscordBot()
          .cache.Guild()
          .roles.cache.get(environment.BOT_ROLE_WHITELIST)?.members;
        if (!whitelistedMemberCollection) return;

        const whitelistedMemberIds = [
          ...whitelistedMemberCollection.values(),
        ].map((member) => member.user.id);

        this.whitelist = whitelistedMemberIds;
        const time = this.deps.Logger().getLogTimeMs("refreshWhitelist");
        this.deps
          .Logger()
          .verbose(
            `Refreshing whitelist for ${this.whitelist.length} members took ${time}ms`,
          );
      });
  };

  initiateLogin = async (player: ServerPlayer, data: DiscordUserData) => {
    if (!player || !player.valid) {
      return;
    }

    await this.deps
      .UserRepository()
      .upsert({ id: data.id, name: `${data.username}#${data.discriminator}` });

    const user = await this.deps.UserRepository().findById(data.id);
    console.log(user);
  };
}
