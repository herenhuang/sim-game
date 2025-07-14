// Crisis Simulation Types
export interface SimulationState {
  currentTurn: number; // 1, 2, or 3
  storySoFar: string;
  userPath: string[]; // Array of "Momentum" or "Method" classifications
  userActions: string[]; // Array of action summaries
}

export interface HandleTurnRequest {
  userInput: string;
  storySoFar: string;
}

export interface HandleTurnResponse {
  status: 'success' | 'needs_retry';
  classification?: string; // "Momentum" or "Method"
  actionSummary?: string;
  nextSceneText?: string;
  errorMessage?: string;
}

export interface Archetype {
  name: string;
  emoji: string;
  flavorText: string;
}

// The four crisis archetypes based on Momentum vs Method
export const ARCHETYPES: Record<string, Archetype> = {
  "crisis_catalyst": {
    name: "The Crisis Catalyst",
    emoji: "🔥🔥🔥",
    flavorText: "You turn chaos into momentum. When everything's breaking, you're the one who gets it moving again."
  },
  "rapid_strategist": {
    name: "The Rapid Strategist", 
    emoji: "🔥🔥⚡️",
    flavorText: "You move fast but think two steps ahead. Speed with direction."
  },
  "systematic_solver": {
    name: "The Systematic Solver",
    emoji: "⚡️⚡️🔥", 
    flavorText: "You fix the problem and the process that created it. One crisis at a time, you make things better permanently."
  },
  "systems_architect": {
    name: "The Systems Architect",
    emoji: "⚡️⚡️⚡️",
    flavorText: "You build the infrastructure that prevents tomorrow's fires. Long-term thinking, lasting impact."
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