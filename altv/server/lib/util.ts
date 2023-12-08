import type { Player } from "alt-server";

export function isValidPlayer(player: Player) {
  return !(player === null || player === undefined || !player.valid);
}
