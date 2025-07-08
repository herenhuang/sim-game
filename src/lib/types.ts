export interface Choice {
  label: string;
  weight: number;
  archetype: string;
}

export interface Turn {
  scene: string;
  options: Choice[];
}

export interface UserChoice {
  turn: number;
  weight: number;
  label: string;
  archetype: string;
}

export interface SimulationContext {
  project: string;
  stakeholder: string;
}

export interface SimulationData {
  sessionId: string;
  createdAt: string;
  context: SimulationContext;
  choices: UserChoice[];
  rawScore: number;
  persona: string;
}

export interface Persona {
  title: string;
  description: string;
}

export const PERSONAS: Record<string, Persona> = {
  "firefighter": {
    title: "The Passionate Firefighter",
    description: "You have a bias for immediate action. When problems arise, you're the first to grab the fire extinguisher, tackling issues head-on to protect the project and the team."
  },
  "planner": {
    title: "The Pragmatic Planner", 
    description: "You balance urgency with analysis. Your instinct is to pause, gather data, and create a coordinated plan, ensuring the team's response is both effective and efficient."
  },
  "captain": {
    title: "The Stoic Captain",
    description: "You are a source of stability in a storm. You absorb pressure, maintain a big-picture view, and calmly guide the team forward, fostering resilience and confidence."
  }
}

export function getPersonaFromScore(score: number): Persona {
  if (score <= 4) return PERSONAS.firefighter;
  if (score <= 6) return PERSONAS.planner;
  return PERSONAS.captain;
}