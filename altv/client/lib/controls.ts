import { Player, showCursor, toggleGameControls } from "alt-client";
import { freezeEntityPosition } from "natives";

/** Player is able to move */
var isMove = false;
/**
 * Provides an interface to altv's `toggleGameControls`
 * @param isActive Wether the player should be able to move
 */
export function setMovement(isActive: boolean) {
  if (isActive === isMove) return;
  toggleGameControls((isMove = isActive));
}

/** Player is frozen in place */
var isFreeze = false;
/**
 * Provides an interface to the gta native `freezeEntityPosition`
 * @param isActive Wether the player should be frozen in place
 */
export function setFreeze(isActive: boolean) {
  if (isActive === isFreeze) return;
  freezeEntityPosition(Player.local.scriptID, (isFreeze = isActive));
}

/** Player cursor is visible */
var isCursor = false;
/**
 * Provides an interface to cursor visibility
 * @param isActive Wether the cursor should be shown
 */
export function setCursor(isActive: boolean) {
  if (isActive === isCursor) return;
  showCursor((isCursor = isActive));
}

/**
 * Shorthand interaction for setting movement, freeze and cursor
 * @param isGameMode `true` if player is supposed to be in game-mode, `false` if ui-mode
 */
export function setGameControls(isGameMode: boolean) {
  setMovement(isGameMode);
  setFreeze(!isGameMode);
  setCursor(!isGameMode);
}
