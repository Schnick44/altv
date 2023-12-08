import * as dotenv from "dotenv";
import * as env from "env-var";

dotenv.config();

export const environment = {
  ENABLE_WHITELIST: env.get("ENABLE_WHITELIST").required().asBool(),
  ENABLE_VERBOSE: env.get("ENABLE_VERBOSE").required().asBool(),

  DISCORD_CLIENT_ID: env.get("DISCORD_CLIENT_ID").required().asString(),
  DISCORD_CLIENT_SECRET: env.get("DISCORD_CLIENT_SECRET").required().asString(),
  DISCORD_REDIRECT_IP: env.get("DISCORD_REDIRECT_IP").required().asString(),
  DISCORD_REDIRECT_PORT: env.get("DISCORD_REDIRECT_PORT").required().asString(),

  BOT_GUILD: env.get("BOT_GUILD").required().asString(),
  BOT_ROLE_WHITELIST: env.get("BOT_ROLE_WHITELIST").required().asString(),
  BOT_SECRET: env.get("BOT_SECRET").required().asString(),
};
