import { Archetype } from '../types';

// The four remix archetypes based on Momentum vs Method
export const ARCHETYPES: Record<string, Archetype> = {
  "crisis_catalyst": {
    name: "The Crisis Catalyst",
    emoji: "🔥🔥🔥",
    flavorText: "You turn chaos into momentum. When everything's breaking, you're the one who gets it moving again. You have an instinct for triage—you know what needs immediate attention and what can wait. Teams rely on you because you don't freeze under pressure; you channel it into action. Your superpower is creating forward motion when others are paralyzed by uncertainty. Just watch out for burnout—sometimes the fire you're putting out could have been prevented with a bit more planning upfront."
  },
  "rapid_strategist": {
    name: "The Rapid Strategist", 
    emoji: "🔥🔥⚡️",
    flavorText: "You move fast but think two steps ahead. Speed with direction. You're the rare person who can act decisively without being reckless—you see the immediate problem AND the bigger picture. Teams love working with you because you keep projects moving while actually making them better. You excel in environments where both urgency and quality matter. Your challenge is communicating your rapid thinking to teammates who need more time to process. Remember: not everyone can keep up with your mental pace."
  },
  "systematic_solver": {
    name: "The Systematic Solver",
    emoji: "⚡️⚡️🔥", 
    flavorText: "You fix the problem and the process that created it. One crisis at a time, you make things better permanently. You have the discipline to resist quick fixes when you know they'll create bigger problems later. Teams appreciate that you don't just put band-aids on issues—you actually solve them. You're building towards something sustainable, not just getting through today. Your weakness? Sometimes the perfect solution takes too long, and good enough would have been better. Learn to recognize when speed trumps perfection."
  },
  "systems_architect": {
    name: "The Systems Architect",
    emoji: "⚡️⚡️⚡️",
    flavorText: "You build the infrastructure that prevents tomorrow's fires. Long-term thinking, lasting impact. You see patterns others miss and design solutions that scale. While others are fighting today's crisis, you're preventing next month's. Teams benefit enormously from your foresight—the problems that never happen because you anticipated them. Your challenge is staying relevant when the building is actually on fire. Sometimes the team needs you to grab a hose instead of redesigning the sprinkler system. Balance your vision with present needs."
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
