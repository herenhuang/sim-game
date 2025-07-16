import { Archetype } from '../types';

export const SCENARIO_CONTEXT = "The user's viral music remix has a potential copyright issue, and they are navigating the fallout and opportunities.";

export const GUARD_RAIL_PROMPT = (userInput: string) => `System: You are a simple safety filter. Your only job is to identify responses that are harmful, abusive, spam, or complete nonsense.

Task: Is this response harmful, abusive, spam, or complete nonsense? Respond with "YES" if it's harmful/spam/nonsense that should be blocked, or "NO" if it's fine to proceed. Accept all casual language, short responses, and normal human reactions.

# Scenario Context:
${SCENARIO_CONTEXT}

# User's Response:
"${userInput}"

# Your Verdict (YES or NO):`;

export const ENGINE_PROMPT = (userInput: string, storySoFar: string, nextStoryBeat: string | null = null) => `System: You are a master storyteller and behavioral psychologist creating a realistic simulation. Your job is to analyze the user's response, classify their core approach, and continue the story in a way that feels natural and flows smoothly into the next story development.

# 1. The Axis of Analysis
You must classify the user's approach as one of two types:
- 🔥 Momentum: This approach prioritizes immediate action to change the situation now. It's about acting quickly to seize opportunities or address challenges directly.
- ⚡️ Method: This approach prioritizes careful analysis and understanding before acting. It's about gathering information and planning to ensure the next move is well-informed.

# 2. Story Context
So far, the story is:
${storySoFar}

# 3. The User's Latest Action
"${userInput}"

${nextStoryBeat ? `# 4. Next Story Development
After your response, the story will develop as follows: "${nextStoryBeat}"
Your continuation should flow naturally toward this development without directly stating it.

# 5. Your Task` : `# 4. Your Task`}
Based on all the above, perform three actions and return them in a single JSON object.
1.  **classify:** Classify the user's philosophical approach in their latest action as either "Momentum" or "Method".
2.  **continue_story:** Write the next 2-3 sentences of the story, continuing the narrative naturally in the same tone and context as established.
3.  **summarize_action:** Write a brief, active summary of the user's core action in this turn.

Return your response ONLY as a valid JSON object with three keys: "classification", "next_scene_text", and "action_summary".

Example Output:
{
  "classification": "Momentum",
  "next_scene_text": "You decide to take action immediately. The situation begins to shift...",
  "action_summary": "taking immediate action to address the situation"
}`;

// The four remix archetypes based on Momentum vs Method
export const ARCHETYPES: Record<string, Archetype> = {
  "crisis_catalyst": {
    name: "The Crisis Catalyst",
    emoji: "🔥",
    subtitle: "You act when others freeze. Chaos sharpens your focus.",
    flavorText: "You respond to pressure with speed and decisiveness. When others are still naming the problem, you're already doing something about it. You're at your best in live fire - triaging fast, reducing harm, keeping momentum alive.\n\nPeople lean on you in moments of uncertainty because they know you won't stall. You instinctively cut to what matters, and you're willing to absorb risk if it keeps the engine running.\n\nBut not everything is a fire. And not all fires need you to jump in first. The challenge is learning when urgency is real - and when it's your reflex talking. Sustainable leadership means knowing when not to act."
  },
  "rapid_strategist": {
    name: "The Rapid Strategist", 
    emoji: "⚡️",
    subtitle: "You move fast - without losing the bigger picture.",
    flavorText: "You don't just react. You adapt. You make moves quickly, but they're rarely random. Your gift is integrating speed and foresight: acting decisively while still accounting for downstream effects.\n\nYou're the person who keeps things from stalling, but doesn't break them in the process. In fast-moving environments, you're often the glue: unblocking, shaping direction, and adjusting on the fly.\n\nBut sometimes, your speed hides how much you're still figuring out. You might move so fast that others can't follow... or don't trust there's a strategy behind the urgency. Slow down just enough to loop others in."
  },
  "systematic_solver": {
    name: "The Systematic Solver",
    emoji: "🧩", 
    subtitle: "You fix what broke - and the pattern that broke it.",
    flavorText: "You think in layers. Not just 'what went wrong?' but: 'why did this happen?' You're the person who moves deliberately in a crisis - assessing, probing, building something that won't break again.\n\nYour work is often invisible until it's obvious: that thing didn't fall apart because you quietly rerouted its failure point. You're not flashy, but you're trustworthy.\n\nYour shadow is perfectionism. You wait too long for clarity when messy action might have been enough. Not every fix needs to be final. Sometimes, it's okay to move forward before every detail is known."
  },
  "systems_architect": {
    name: "The Systems Architect",
    emoji: "📐",
    subtitle: "You think beyond today - and build to prevent tomorrow's fires.",
    flavorText: "You're a long-term thinker in a short-term world. You see failure modes before others see friction. You design for durability, edge cases, and complexity - often in ways that make things look simple on the surface.\n\nPeople rarely notice the things that don't break, but that's your legacy. You prevent chaos by never letting it start.\n\nThe risk? You stay stuck in theory while the real world burns. In moments of crisis, your strength can become your blind spot. Sometimes the best system is the one you can duct-tape right now."
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
    return ARCHETYPES.crisis_catalyst;
  } else if (momentumCount === 2) {
    return ARCHETYPES.rapid_strategist;
  } else if (momentumCount === 1) {
    return ARCHETYPES.systematic_solver;
  } else {
    return ARCHETYPES.systems_architect;
  }
}
