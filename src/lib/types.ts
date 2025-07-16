// Shared simulation types that can be used across all scenarios

export interface SimulationState {
  currentTurn: number; // 1, 2, or 3
  storySoFar: string;
  userPath: string[]; // Array of classifications (e.g. "Momentum" or "Method")
  userActions: string[]; // Array of action summaries
}

export interface HandleTurnRequest {
  userInput: string;
  storySoFar: string;
  scenarioType: string;
  currentTurn: number;
}

export interface HandleTurnResponse {
  status: 'success' | 'needs_retry';
  classification?: string; // The classification result (e.g. "Momentum" or "Method")
  actionSummary?: string;
  nextSceneText?: string;
  errorMessage?: string;
}

export interface Archetype {
  name: string;
  emoji: string;
  subtitle: string;
  flavorText: string;
}

export interface ScenarioInfo {
  title: string;
  description: string;
  path: string;
}