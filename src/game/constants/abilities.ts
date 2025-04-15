import { Ability } from "../types/abilities";

export const ABILITIES_CONFIG: Record<
  string,
  Omit<Ability, "execute" | "currentCooldown" | "isReady">
> = {
  q: {
    key: "q",
    name: "Projectile Shot",
    cooldown: 0.2,
    range: 20,
    damage: 1,
  },
  w: {
    key: "w",
    name: "Shield",
    cooldown: 8,
    duration: 2,
    damage: 0,
  },
  e: {
    key: "e",
    name: "Dash",
    cooldown: 5,
    duration: 0.3,
    damage: 0,
  },
  r: {
    key: "r",
    name: "Flash",
    cooldown: 20,
    range: 5,
    damage: 0,
  },
};
