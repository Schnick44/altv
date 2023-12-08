import type { DiscordClient } from ".";

export function getMember(this: DiscordClient, id: string) {
  return this.cache.Guild().members.cache.get(id);
}

export async function renameUser(
  this: DiscordClient,
  id: string,
  name: string,
) {
  const member = this.getMember(id);
  if (!member || member.user.id === this.cache.Guild().ownerId)
    return undefined;

  return await member.setNickname(name);
}

export function fetchUserData(this: DiscordClient, id: string) {
  const member = this.getMember(id);
  if (!member) return undefined;

  return {
    avatarUrl: member.user.displayAvatarURL(),
    nickname: member.displayName,
    color: member.displayHexColor,
    role: member.roles.highest.name,
  };
}
