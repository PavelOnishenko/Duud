import { Animation } from './animator.js';

export const ANIMATIONS: Animation[] = [];

export function getAnimationByName(name: string): Animation | undefined {
  return ANIMATIONS.find((anim) => anim.name === name);
}
