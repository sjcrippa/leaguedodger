import { Vector3 } from "three";

export type AbilityKey = "q" | "w" | "e" | "r";

export const ABILITY_KEYS: AbilityKey[] = ["q", "w", "e", "r"];

export interface Projectile {
  id: string;
  position: Vector3;
  direction: Vector3;
  createdAt: number;
}

export interface Ability {
  key: AbilityKey;
  name: string;
  cooldown: number;
  range?: number;
  duration?: number;
}

export type AbilityEffect = {
  type: "shield" | "movement";
  value: number;
  duration?: number;
  target: "self" | "area";
};
