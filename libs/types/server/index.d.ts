import { Maybe } from "../util";

declare module "alt-server" {
  interface Player {
    token?: string;
  }
}

declare type DiscordUserData = {
  id: string;
  username: string;
  discriminator: string;
  avatar: string;
  banner: Maybe<String>;
  banner_color: Maybe<String>;
};
