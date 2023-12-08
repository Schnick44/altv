import { SlashCommandBuilder } from "discord.js";
import Controller, { ServerHandlerIdentifier } from "../../events/controller";
import type { ChatInputCommandInteraction } from "discord.js";
import { Maybe } from "schnick";
import { AuthenticationHandler } from "../../events/handler/AuthenticationHandler";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("refreshwl")
    .setDescription("Refreshes the current authentication whitelist"),
  async execute(interaction: ChatInputCommandInteraction) {
    const AuthHandler = Controller.handler[
      ServerHandlerIdentifier.Authentication
    ] as Maybe<AuthenticationHandler>;
    if (!AuthHandler) {
      return interaction.reply("Could not find Auth Handler");
    }

    AuthHandler.refreshWhitelist();
    return interaction.reply("Whitelist has been manually refreshed");
  },
};
