import * as alt from "alt-server";
import { DiscordClient } from ".";
import path from "path";
import fs from "fs";
import type { ApplicationCommandData, Interaction } from "discord.js";

export function loadCommands(this: DiscordClient) {
  if (!this.client.application) {
    this.deps.Logger().alert("Discord Client Application is not ready yet");
    return;
  }

  const commandsPath = path.join(
    alt.Resource.current.path,
    "server/discord/commands",
  );
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));

  const commands: ApplicationCommandData[] = [];
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ("data" in command && "execute" in command) {
      this.commands.set(command.data.name, command);
      commands.push(command.data);
    } else {
      this.deps
        .Logger()
        .alert(
          `The command at ${filePath} is missing a required "data" or "execute" property`,
        );
    }
  }

  this.client.application.commands.set(commands);
}

export async function onCommandInteraction(
  this: DiscordClient,
  interaction: Interaction,
) {
  if (!interaction.isChatInputCommand()) return;

  const command = this.commands.get(interaction.commandName);

  if (!command) {
    this.deps
      .Logger()
      .alert(`No command matching ${interaction.commandName} was found`);
    return;
  }

  await command.execute(interaction);
}
