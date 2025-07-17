import { Archetype } from '../types';

export const SCENARIO_CONTEXT = "The user's viral music remix has a potential copyright issue, and they are navigating the fallout and opportunities.";

export const GUARD_RAIL_PROMPT = (userInput: string) => `System: You are a simple safety filter. Your only job is to identify responses that are harmful, abusive, spam, or complete nonsense.

Task: Is this response harmful, abusive, spam, or complete nonsense? Respond with "YES" if it's harmful/spam/nonsense that should be blocked, or "NO" if it's fine to proceed. Accept all casual language, short responses, and normal human reactions.

# Scenario Context:
${SCENARIO_CONTEXT}

# User's Response:
"${userInput}"

# Your Verdict (YES or NO):`;

export const STORY_PROMPT = (userInput: string, storySoFar: string, currentQuestion: string | null = null) => `You're an expert storyteller who reads people's emotions perfectly. Your only job is to continue their story authentically based on their emotional state and attitude.

# The Situation
Someone's navigating a viral remix with copyright complications. They just processed a situation and their response reveals their emotional state and decision-making approach.

# Story Context So Far
${storySoFar}

${currentQuestion ? `# Current Situation They're Responding To
${currentQuestion}

` : ''}# Their Internal Response/Thoughts
"${userInput}"

# Your Task: Read Their Emotion & Continue Their Story

**Key Understanding**: The user input above represents the protagonist's internal thoughts and feelings about the situation. You need to write what they DO next based on that emotional state.

**Emotional Intelligence**: Pay careful attention to:
- **Hedging language** ("I don't think", "maybe", "kind of") = uncertainty, not confidence
- **Collaborative cues** ("we can do that", "let's work together") = partnership-seeking
- **Help-seeking** ("can you help") = wanting guidance
- **Tentative language** = cautious approach, not dismissiveness

**Story Continuation**: Write what the protagonist naturally DOES next based on their actual emotional state. Show their immediate reaction and mental state, NOT future actions or next steps.

**Voice**: Write in second person ("you") as a neutral narrator. EXACTLY 2 sentences that capture their current moment.

**Critical Constraints**: 
- Focus on IMMEDIATE reaction to the current situation only
- Do NOT write actions that anticipate future scenarios  
- Do NOT write them taking steps toward next challenges
- Stay in the present moment of their emotional response

Return ONLY the story text - no JSON, no explanations, just the continuation of their story.`;

export const CLASSIFICATION_PROMPT = (userInput: string) => `You are analyzing someone's response style to determine their approach type. Focus ONLY on their original words - ignore any story continuation.

# Their Response
"${userInput}"

# Classification Task
Based on their actual words and tone, which approach do they lean toward?

**Momentum**: Acting quickly, trusting instincts, seizing the moment, taking risks
**Method**: Wanting to think it through, gathering information, being cautious, planning ahead

**Important**: Base this ONLY on their original response. Look for:
- Language certainty vs uncertainty  
- Action orientation vs planning orientation
- Risk tolerance vs caution
- Individual decision-making vs seeking input/collaboration

Return ONLY: "Momentum" or "Method"`;

export const CONCLUSION_PROMPT_PAGE1 = (storySoFar: string, userResponses: string[]) => `You're wrapping up the story threads from someone's viral remix journey. Write what actually happened with each thread based on their specific responses.

# Their Journey
Turn 1 (Casey's copyright question): "${userResponses[0] || 'No response'}"
Turn 2 (Record label deadline): "${userResponses[1] || 'No response'}"  
Turn 3 (Artist collaboration offer): "${userResponses[2] || 'No response'}"

# Your Task
Write a concise wrap-up that resolves these three threads based on their actual responses:
- What happened with Casey and the copyright concern?
- What happened with the record label and their deadline?
- What happened with the artist collaboration offer?

# Writing Instructions
- Write in second person ("you") - you're telling THEIR story
- Keep it casual and conversational, like a friend recapping what happened
- MAXIMUM 300 characters total
- Focus on concrete outcomes, not feelings
- Reference the specific people/situations (Casey, record label, artist)

# Format
CONCLUSION_PAGE1: [~300 chars MAX - what actually happened with the three threads]

# CRITICAL: Stay under 300 characters or the UI will break. Be very concise!

Write the story resolution.`;

export const CONCLUSION_PROMPT_PAGE2 = (storySoFar: string, userResponses: string[]) => `You're writing the personal reflection for someone's viral remix journey. Focus on what this experience taught them about themselves as a creator.

# Their Journey Context
Turn 1 response: "${userResponses[0] || 'No response'}"
Turn 2 response: "${userResponses[1] || 'No response'}"  
Turn 3 response: "${userResponses[2] || 'No response'}"

# Your Task
Write a personal reflection about what this experience taught them about themselves and their creative journey.

# Writing Instructions
- Write in second person ("you") - you're telling THEIR story
- Keep it casual and conversational, like a friend reflecting
- MAXIMUM 300 characters total
- Focus on personal growth, creative insights, moving forward
- This is about THEIR individual creative journey as a solo music maker

# Format
CONCLUSION_PAGE2: [~300 chars MAX - personal reflection and moving forward]

# CRITICAL: Stay under 300 characters or the UI will break. Be very concise!

Write the personal reflection.`;

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
export const INITIAL_SCENE = "You've been making music in your spare time for the past few months. Last night, you remixed a popular song that's been stuck in your head. You stayed up until 4AM, perfecting every beat. You posted it online this morning. It went viral overnight - 2 million views and climbing. But there's a problem: you used the original song's audio without getting permission. The comments are blowing up with both praise and questions about copyright.";

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
