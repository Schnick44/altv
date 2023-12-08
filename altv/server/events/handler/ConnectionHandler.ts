import { Player } from "alt-server";
import { ServerHandlerIdentifier } from "../controller";
import { addServerEventListener, removeEventListener } from "../observer";

export class ConnectionHandler implements IEventHandler {
  identifier = ServerHandlerIdentifier.Connection;

  constructor() {}

  async initialize() {
    addServerEventListener("playerConnect", this.onPlayerConnect);
    addServerEventListener("playerDisconnect", this.onPlayerDisconnect);
  }

  remove() {
    removeEventListener("playerConnect");
    removeEventListener("playerDisconnect");
  }

  onPlayerConnect(player: Player) {
    if (!player.valid) return;

    player.spawn(729, -553, 27, 0);
    player.dimension = 0;
    player.model = "mp_m_freemode_01";
  }

  onPlayerDisconnect(player: Player, reason: string) {
    player;
    reason;
  }
}
