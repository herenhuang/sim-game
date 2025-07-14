import { Archetype } from '../types';

// The four crisis archetypes based on Momentum vs Method
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
  "Your Director of Product DMs you. The message has only five words: 'What is our immediate response?'",
  "It's now 11:30 AM. You're on an emergency Zoom with leads from Marketing, Comms, and Engineering. The Head of Marketing says, 'We need to send an email to all users now. What is the single, most important message we need to communicate?'",
  "It's a week later. The Project Orion crisis is over. The team is gathered for the official retrospective. The conversation turns from what happened to how to prevent it from happening again. Your Director turns to you and says, 'I want one new rule for our launch playbook that will prevent this kind of failure. What is it?'"
];

// Initial scene text
export const INITIAL_SCENE = "It's 9:00 AM on launch day for Project Orion. The announcement just went live. You're watching the real-time analytics when your stomach drops. The main dashboard lights up with red alerts. Simultaneously, the #customer-support channel explodes. A lead support agent tags you directly: '@here - We're getting flooded with tickets. Users are saying they can't log in to their new accounts after creation. This is a P0 issue.'";

// Scenario metadata
export const SCENARIO_INFO = {
  title: "The 9 AM Catastrophe",
  description: "A crisis simulation testing your problem-solving approach during a product launch emergency.",
  path: "/crisis-simulation"
};

// Function to determine archetype from user path
export function getArchetypeFromPath(userPath: string[]): Archetype {
  const momentumCount = userPath.filter(classification => classification === "Momentum").length;
  
  if (momentumCount === 3) {
    return ARCHETYPES.crisis_catalyst;
  } else if (momentumCount === 2) {
    return ARCHETYPES.rapid_strategist;
  } else if (momentumCount === 1) {
    return ARCHETYPES.systematic_solver;
  } else {
    return ARCHETYPES.systems_architect;
  }
}
