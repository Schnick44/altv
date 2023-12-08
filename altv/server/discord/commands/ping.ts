import { SlashCommandBuilder } from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js";

module.exports = {
  data: new SlashCommandBuilder().setName("ping").setDescription("pong?"),
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply("pong!");
  },
};
