import { Client, Collection, Events, GatewayIntentBits } from "discord.js";
import type {
  ChatInputCommandInteraction,
  Guild,
  Role,
  ApplicationCommandData,
} from "discord.js";
import { environment } from "../infrastructure/environment";
import { cached } from "../lib/cache";
import type { Logger } from "../infrastructure/logger";
import { fetchUserData, getMember, renameUser } from "./user";
import { loadCommands, onCommandInteraction } from "./commands";

export class DiscordClient {
  client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessages,
    ],
  });

  cache = {
    Guild: (() => undefined) as unknown as Provider<Guild>,
    WhitelistRole: (() => undefined) as unknown as Provider<Role>,
    Commands: (() => []) as Provider<{}[]>,
  };

  commands = new Collection<
    string,
    {
      data: ApplicationCommandData;
      execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
    }
  >();

  constructor(
    public deps: {
      Logger: Provider<Logger>;
    },
  ) {
    this.client.on(Events.Error, this.onError);
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.client.login(environment.BOT_SECRET).catch(reject);

      this.client.on(Events.ClientReady, () => {
        this.cache.Guild = cached(() =>
          this.client.guilds.cache.get(environment.BOT_GUILD),
        ) as unknown as Provider<Guild>;
        if (!this.cache.Guild()) reject(new Error("Could not find Bot Guild"));

        this.loadCommands();

        this.addEventListeners();

        resolve(true);
      });
    });
  }

  addEventListeners() {
    this.client.on(Events.InteractionCreate, this.onCommandInteraction);
  }

  onError(err: Error) {
    this.deps.Logger().trace(err);
  }

  loadCommands = loadCommands.bind(this);
  onCommandInteraction = onCommandInteraction.bind(this);

  getMember = getMember.bind(this);
  renameUser = renameUser.bind(this);
  fetchUserData = fetchUserData.bind(this);
}
