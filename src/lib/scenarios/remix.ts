import { Archetype } from '../types';

// The four remix archetypes based on Momentum vs Method
export const ARCHETYPES: Record<string, Archetype> = {
  "viral_hustler": {
    name: "The Viral Hustler",
    emoji: "🔥🔥🔥",
    flavorText: "You ride the wave when it's hot. Strike while the iron's burning and deal with consequences later."
  },
  "calculated_creator": {
    name: "The Calculated Creator", 
    emoji: "🔥🔥⚡️",
    flavorText: "You move fast but cover your bases. Speed with strategy, hype with protection."
  },
  "principled_artist": {
    name: "The Principled Artist",
    emoji: "⚡️⚡️🔥", 
    flavorText: "You do things the right way, even when it's slower. Build sustainable success, not flash-in-the-pan fame."
  },
  "legal_eagle": {
    name: "The Legal Eagle",
    emoji: "⚡️⚡️⚡️",
    flavorText: "You cross every T and dot every I. Long-term career protection over short-term gains."
  }
};

// Static questions for the three turns
export const QUESTIONS = [
  "Your phone is buzzing with notifications. Some comments are saying 'This is fire!' Others are saying 'Isn't this copyright infringement?' Your friend Casey texts you: 'Should we be worried about this copyright thing?'",
  "The situation gets crazier. A major record label DMs you: 'We love your remix. We want to sign you for an official release, but we need to move fast - the hype window is short. Can you get permission from the original artist by tomorrow?'",
  "Plot twist: The original artist's manager emails you. They're not angry - they want to collaborate! But they want to re-record the whole thing 'properly' in a studio. This would take at least two weeks and kill your current viral momentum. What's your call?"
];

// Initial scene text
export const INITIAL_SCENE = "You and two friends created a remix of a popular song. You stayed up all night working on it, and the result is incredible. You posted it online, and it went viral overnight - 2 million views and climbing. But there's a problem: you used the original song's audio without getting permission. The comments are blowing up with both praise and questions about copyright.";

// Scenario metadata
export const SCENARIO_INFO = {
  title: "The Remix Controversy",
  description: "A viral music scenario testing how you handle creative success mixed with legal uncertainty.",
  path: "/remix-simulation"
};

// Function to determine archetype from user path
export function getArchetypeFromPath(userPath: string[]): Archetype {
  const momentumCount = userPath.filter(classification => classification === "Momentum").length;
  
  if (momentumCount === 3) {
    return ARCHETYPES.viral_hustler;
  } else if (momentumCount === 2) {
    return ARCHETYPES.calculated_creator;
  } else if (momentumCount === 1) {
    return ARCHETYPES.principled_artist;
  } else {
    return ARCHETYPES.legal_eagle;
  }
}